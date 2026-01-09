import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { HealthRecord } from "../models/healthRecord.model.js";
import { Animal } from "../models/animal.model.js";

const createHealthRecord = asyncHandler(async (req, res) => {
    const {
      animalId,
      type,
      title,
      description,
      date,
      nextDueDate,
      veterinarian,
      cost,
      medicine,
      dosage,
      status,
      notes
    } = req.body;
  
    if (!animalId) throw new ApiError(400, "Animal ID is required");
    if (!type) throw new ApiError(400, "Record type is required");
    if (!title?.trim()) throw new ApiError(400, "Title is required");
  
    // Verify animal exists
    const animal = await Animal.findOne({ _id: animalId, userId: req.user._id, isActive: true });
    if (!animal) throw new ApiError(404, "Animal not found or no permission");
  
    // Handle photo upload
    let photoUrl = null;
    if (req.file?.path) {
      const uploadedPhoto = await uploadOnCloudinary(req.file.path);
      if (!uploadedPhoto) throw new ApiError(500, "Failed to upload photo");
      photoUrl = uploadedPhoto.secure_url;
    }
  
    // ------------------------------
    // Production-grade: handle status and nextDueDate
    // ------------------------------
    let recordStatus = status;
    let recordNextDue = nextDueDate ? new Date(nextDueDate) : null;
  
    if (type === "Vaccination") {
      // If no status provided, default to Scheduled for upcoming vaccinations
      if (!recordStatus) recordStatus = "Scheduled";
  
      // If Scheduled but no nextDueDate provided, use today + 30 days as default
      if (recordStatus === "Scheduled" && !recordNextDue) {
        const defaultDue = new Date();
        defaultDue.setDate(defaultDue.getDate() + 30);
        recordNextDue = defaultDue;
      }
  
      // If Completed, nextDueDate is null
      if (recordStatus === "Completed") recordNextDue = null;
    } else {
      // For non-vaccination records, default status to Completed
      if (!recordStatus) recordStatus = "Completed";
    }
  
    // Create record
    const healthRecord = await HealthRecord.create({
      animalId,
      userId: req.user._id,
      type,
      title: title.trim(),
      description: description?.trim(),
      date: date || new Date(),
      nextDueDate: recordNextDue,
      veterinarian: veterinarian?.trim(),
      cost: cost ? Number(cost) : undefined,
      medicine: medicine?.trim(),
      dosage: dosage?.trim(),
      photo: photoUrl,
      status: recordStatus,
      notes: notes?.trim()
    });
  
    // Populate animal info
    const populatedRecord = await HealthRecord.findById(healthRecord._id)
      .populate("animalId", "tagNumber name type photo status");
  
    return res.status(201).json(
      new ApiResponse(201, populatedRecord, "Health record added successfully")
    );
  });


const getHealthRecords = asyncHandler(async (req, res) => {
    const { 
        animalId, 
        type, 
        status,
        startDate, 
        endDate, 
        page = 1, 
        limit = 20 
    } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    // Filter by animal
    if (animalId) {
        query.animalId = animalId;
    }
    
    // Filter by type
    if (type) {
        query.type = type;
    }
    
    // Filter by status
    if (status) {
        query.status = status;
    }

    // Validate date inputs
    if (startDate && isNaN(new Date(startDate).getTime())) {
        throw new ApiError(400, "Invalid startDate");
    }

    if (endDate && isNaN(new Date(endDate).getTime())) {
        throw new ApiError(400, "Invalid endDate");
    }
    
    // Filter by date range
    if (startDate || endDate) {
        query.date = {};
        if (startDate) {
            query.date.$gte = new Date(startDate);
        }
        if (endDate) {
            query.date.$lte = new Date(endDate);
        }
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query with population
    const records = await HealthRecord.find(query)
        .populate('animalId', 'tagNumber name type photo')
        .sort({ date: -1 })
        .limit(limitNum)
        .skip(skip)
        .select('-__v');
    
    // Get total count
    const totalRecords = await HealthRecord.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limitNum);
    
    return res.status(200).json(
        new ApiResponse(200, {
            records,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalRecords,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        }, "Health records fetched successfully")
    );
});


const getRecordsByAnimal = asyncHandler(async (req, res) => {
    const { animalId } = req.params;
    
    // Verify animal exists and belongs to user
    const animal = await Animal.findOne({
        _id: animalId,
        userId: req.user._id,
        isActive: true
    }).select('tagNumber name type photo status');
    
    if (!animal) {
        throw new ApiError(404, "Animal not found");
    }
    
    // Get all records for this animal
    const records = await HealthRecord.find({
        animalId,
        userId: req.user._id
    })
    .sort({ date: -1 })
    .select('-__v');
    
    // Calculate summary
    const totalRecords = records.length;
    const lastCheckup = records.find(r => r.type === 'Checkup')?.date || null;
    const nextVaccination = records
        .filter(r => r.type === 'Vaccination' && r.nextDueDate && r.status === 'Scheduled')
        .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))[0]?.nextDueDate || null;
    
    return res.status(200).json(
        new ApiResponse(200, {
            animal,
            records,
            summary: {
                totalRecords,
                lastCheckup,
                nextVaccination
            }
        }, "Animal health records fetched successfully")
    );
});


const getUpcomingRecords = asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysNum);
  
    // Upcoming: Scheduled vaccinations/checkups
    const upcomingRecords = await HealthRecord.find({
      userId: req.user._id,
      status: "Scheduled",
      nextDueDate: { $gte: today, $lte: futureDate }
    })
      .populate("animalId", "tagNumber name type photo status")
      .sort({ nextDueDate: 1 })
      .select("-__v");
  
    // Overdue
    const overdueRecords = await HealthRecord.find({
      userId: req.user._id,
      status: "Scheduled",
      nextDueDate: { $lt: today }
    })
      .populate("animalId", "tagNumber name type photo status")
      .sort({ nextDueDate: 1 })
      .select("-__v");
  
    // Counts for dashboard
    const dueToday = upcomingRecords.filter(r => {
      const due = new Date(r.nextDueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    }).length;
  
    const dueThisWeek = upcomingRecords.filter(r => {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return new Date(r.nextDueDate) <= weekFromNow;
    }).length;
  
    return res.status(200).json(
      new ApiResponse(200, {
        upcoming: upcomingRecords,
        overdue: overdueRecords,
        counts: {
          dueToday,
          dueThisWeek,
          dueThisMonth: upcomingRecords.length,
          overdue: overdueRecords.length
        }
      }, "Upcoming records fetched successfully")
    );
  });
  

const updateHealthRecord = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        type,
        title,
        description,
        date,
        nextDueDate,
        veterinarian,
        cost,
        medicine,
        dosage,
        status,
        notes
    } = req.body;
    
    // Find record and verify ownership
    const record = await HealthRecord.findOne({
        _id: id,
        userId: req.user._id
    });
    
    if (!record) {
        throw new ApiError(404, "Health record not found");
    }
    
    // Update fields if provided
    if (type) record.type = type;
    if (title !== undefined) record.title = title.trim();
    if (description !== undefined) record.description = description.trim();
    if (date) record.date = date;
    if (nextDueDate !== undefined) record.nextDueDate = nextDueDate;
    if (veterinarian !== undefined) record.veterinarian = veterinarian.trim();
    if (cost !== undefined) record.cost = cost ? Number(cost) : null;
    if (medicine !== undefined) record.medicine = medicine.trim();
    if (dosage !== undefined) record.dosage = dosage.trim();
    if (status) record.status = status;
    if (notes !== undefined) record.notes = notes.trim();
    
    // Handle photo upload if new photo provided
    if (req.file?.path) {
        const uploadedPhoto = await uploadOnCloudinary(req.file.path);
        
        if (!uploadedPhoto) {
            throw new ApiError(500, "Failed to upload photo");
        }
        
        record.photo = uploadedPhoto.secure_url;
    }
    
    await record.save();
    
    // Populate animal info
    const populatedRecord = await HealthRecord.findById(record._id)
        .populate('animalId', 'tagNumber name type photo');
    
    return res.status(200).json(
        new ApiResponse(200, populatedRecord, "Health record updated successfully")
    );
});

const deleteHealthRecord = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find and verify ownership
    const record = await HealthRecord.findOne({
        _id: id,
        userId: req.user._id
    });
    
    if (!record) {
        throw new ApiError(404, "Health record not found");
    }
    
    await record.deleteOne();
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Health record deleted successfully")
    );
});

const getHealthRecordById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find record and verify ownership
    const record = await HealthRecord.findOne({
        _id: id,
        userId: req.user._id
    })
    .populate('animalId', 'tagNumber name type photo')
    .select('-__v');
    
    if (!record) {
        throw new ApiError(404, "Health record not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, record, "Health record fetched successfully")
    );
});

export {
    createHealthRecord,
    getHealthRecords,
    getRecordsByAnimal,
    getUpcomingRecords,
    updateHealthRecord,
    deleteHealthRecord,
    getHealthRecordById,
};
