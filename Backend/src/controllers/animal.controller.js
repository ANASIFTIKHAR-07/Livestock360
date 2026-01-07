import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Animal } from "../models/animal.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const createAnimal = asyncHandler(async(req, res)=> {
    const { tagNumber, name, type, breed, gender, birthDate, weight, notes, status } = req.body;

    if (!tagNumber?.trim()) {
        throw new ApiError(400, "Tag number is required");
    }

    if (!type) {
        throw new ApiError(400, "Animal type is required");
    }
    
    if (!gender) {
        throw new ApiError(400, "Gender is required");
    }
    
    if (!birthDate) {
        throw new ApiError(400, "Birth date is required");
    }

    // Check if tag number already exists for this user
    const existingAnimal = await Animal.findOne({
        userId: req.user._id,
        tagNumber: tagNumber.trim(),
        isActive: true
    });

    if(existingAnimal) {
        throw new ApiError(409, "An animal with this tag number already exists");
    }

    let photoUrl = null;
    if (req.file?.path) {
        const uploadedPhoto = await uploadOnCloudinary(req.file.path);
        
        if (!uploadedPhoto) {
            throw new ApiError(500, "Failed to upload photo to cloud storage");
        }
        
        photoUrl = uploadedPhoto.secure_url;
    }

     // Create animal
     const animal = await Animal.create({
        userId: req.user._id,
        tagNumber: tagNumber.trim(),
        name: name?.trim(),
        type,
        breed: breed?.trim(),
        gender,
        birthDate,
        weight: weight ? Number(weight) : undefined,
        photo: photoUrl,
        notes: notes?.trim(),
        status: status || 'Healthy'
    });

    return res.status(201).json(
        new ApiResponse(201, animal, "Animal added successfully")
    );
});

const getAnimals = asyncHandler(async(req, res)=> {
    const { type, status, search, sort = 'recent', page = 1, limit = 20 } = req.query;

    const query = {
        userId: req.user._id,
        isActive: true
    };

    // Filter by type
    if (type) {
        query.type = type;
    }
    
    // Filter by status
    if (status) {
        query.status = status;
    }

     // Search by tag number or name
     if (search) {
        query.$or = [
            { tagNumber: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } }
        ];
    }

    // Sorting
    let sortQuery = {};
    switch (sort) {
        case 'recent':
            sortQuery = { createdAt: -1 };
            break;
        case 'oldest':
            sortQuery = { createdAt: 1 };
            break;
        case 'name':
            sortQuery = { name: 1, tagNumber: 1 };
            break;
        case 'tagNumber':
            sortQuery = { tagNumber: 1 };
            break;
        default:
            sortQuery = { createdAt: -1 };
    }
    
     // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const animals = await Animal.find(query)
        .sort(sortQuery)
        .limit(limitNum)
        .skip(skip)
        .select('-__v');

    // Get total count for pagination
    const totalAnimals = await Animal.countDocuments(query);
    const totalPages = Math.ceil(totalAnimals / limitNum);

    return res.status(200).json(
        new ApiResponse(200, {
            animals,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalAnimals,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        }, "Animals fetched successfully")
    );
});


const getAnimalById = asyncHandler(async(req, res)=> {
    const { id } = req.params;

    const animal = await Animal.findOne({
        _id: id,
        userId: req.user._id,
        isActive: true
    }).select('-__v');

    if (!animal) {
        throw new ApiError(404, "Animal not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, animal, "Animal fetched successfully")
    );
});


const updateAnimal = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    const { tagNumber, name, type, breed, gender, birthDate, weight, status, notes } = req.body;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 BACKEND - UPDATE ANIMAL RECEIVED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Animal ID:', id);
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    console.log('Status from body:', status);
    console.log('Status type:', typeof status);
    console.log('Status truthy?', !!status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');


    // Find animal and verify ownership
    const animal = await Animal.findOne({
        _id: id,
        userId: req.user._id,
        isActive: true
    });

    if (!animal) {
        throw new ApiError(404, "Animal not found");
    }

     // If updating tag number, check for duplicates
     if (tagNumber && tagNumber.trim() !== animal.tagNumber) {
        const existingAnimal = await Animal.findOne({
            userId: req.user._id,
            tagNumber: tagNumber.trim(),
            _id: { $ne: id },
            isActive: true
        });
        
        if (existingAnimal) {
            throw new ApiError(409, "Another animal with this tag number already exists");
        }
        
        animal.tagNumber = tagNumber.trim();
    }

    // Update fields if provided
    if (name !== undefined) animal.name = name.trim();
    if (type) animal.type = type;
    if (breed !== undefined) animal.breed = breed.trim();
    if (gender) animal.gender = gender;
    if (birthDate) animal.birthDate = birthDate;
    if (weight !== undefined) animal.weight = weight ? Number(weight) : null;


     // ✅ CRITICAL: Status update with detailed logging
    if (status !== undefined && status !== null && status !== '') {
        console.log('✅ UPDATING STATUS FROM', animal.status, 'TO', status);
        animal.status = status;
    } else {
        console.log('⚠️  STATUS NOT UPDATED - Value was:', status);
    }
    
    if (notes !== undefined) animal.notes = notes.trim();


    if (notes !== undefined) animal.notes = notes.trim();



    // Handle photo upload if new photo provided
    if (req.file?.path) {
        const uploadedPhoto = await uploadOnCloudinary(req.file.path);
        
        if (!uploadedPhoto) {
            throw new ApiError(500, "Failed to upload photo");
        }
        
        animal.photo = uploadedPhoto.secure_url;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 SAVING ANIMAL WITH STATUS:', animal.status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await animal.save();

    const savedAnimal = await Animal.findById(id).select('-__v');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ANIMAL SAVED - STATUS IN DB:', savedAnimal.status);
    console.log('Full saved animal:', JSON.stringify(savedAnimal, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return res.status(200).json(
        new ApiResponse(200, animal, "Animal updated successfully")
    );
});

const deleteAnimal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find and verify ownership
    const animal = await Animal.findOne({
        _id: id,
        userId: req.user._id,
        isActive: true
    });
    
    if (!animal) {
        throw new ApiError(404, "Animal not found");
    }
    
    // Soft delete
    animal.isActive = false;
    await animal.save();
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Animal deleted successfully")
    );
});


const getAnimalStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    // Get total count
    const totalAnimals = await Animal.countDocuments({
        userId,
        isActive: true
    });
    
    // Get count by type
    const byType = await Animal.aggregate([
        {
            $match: {
                userId: userId,
                isActive: true
            }
        },
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 }
            }
        }
    ]);

    // Get count by status
    const byStatus = await Animal.aggregate([
        {
            $match: {
                userId: userId,
                isActive: true
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

     // Get recently added animals (last 5)
     const recentlyAdded = await Animal.find({
        userId,
        isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('tagNumber name type photo status createdAt');
    
    // Format the data
    const typeStats = {};
    byType.forEach(item => {
        typeStats[item._id] = item.count;
    });
    
    const statusStats = {};
    byStatus.forEach(item => {
        statusStats[item._id] = item.count;
    });

    return res.status(200).json(
        new ApiResponse(200, {
            totalAnimals,
            byType: typeStats,
            byStatus: statusStats,
            recentlyAdded
        }, "Statistics fetched successfully")
    );
});


export {
    createAnimal,
    getAnimals,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
    getAnimalStats
};