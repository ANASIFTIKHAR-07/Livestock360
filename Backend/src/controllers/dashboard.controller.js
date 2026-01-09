import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Animal } from "../models/animal.model.js";
import { HealthRecord } from "../models/healthRecord.model.js";
import mongoose from "mongoose";

const getDashboardOverview = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 1. Animal Statistics
    const totalAnimals = await Animal.countDocuments({
        userId,
        isActive: true
    });
    
    const animalsByStatus = await Animal.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId), 
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

    
    const statusCounts = {
        healthy: 0,
        needAttention: 0,
        critical: 0,
        unknown: 0
    };
    
    animalsByStatus.forEach(item => {
        switch (item._id) {
            case 'Healthy':
                statusCounts.healthy = item.count;
                break;
            case 'Attention':
                statusCounts.needAttention = item.count;
                break;
            case 'Critical':
                statusCounts.critical = item.count;
                break;
            case 'Unknown':
                statusCounts.unknown = item.count;
                break;
        }
    });
    
    // 2. Upcoming Vaccinations (next 7 days)
    const monthFromNow = new Date(today);
    monthFromNow.setDate(monthFromNow.getDate() + 30);
    
    const upcomingVaccinations = await HealthRecord.find({
        userId,
        status: 'Scheduled',
        type: "Vaccination",
        nextDueDate: {
            $gte: today,
            $lte: monthFromNow
        }
    })
    .populate('animalId', 'tagNumber name type photo status')
    .sort({ nextDueDate: 1 })
    .limit(5)
    .select('type title nextDueDate animalId');

    // Calculate daysUntil for frontend
    const todayTime = today.getTime();
    const upcomingVaccinationsWithDays = upcomingVaccinations.map(record => {
        const dueTime = record.nextDueDate ? new Date(record.nextDueDate).getTime() : null;
        const daysUntil = dueTime ? Math.ceil((dueTime - todayTime) / (1000 * 60 * 60 * 24)) : 0;
        return {
            ...record.toObject(),
            daysUntil
        };
    });
    
    // 3. Overdue Items
    const overdueCount = await HealthRecord.countDocuments({
        userId,
        status: 'Scheduled',
        nextDueDate: { $lt: today }
    });
    
    // 4. Recent Activity (last 10 actions)
    // Combine recent animals and health records
    const recentAnimals = await Animal.find({
        userId,
        isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('tagNumber name type photo createdAt');
    
    const recentHealthRecords = await HealthRecord.find({
        userId
    })
    .populate('animalId', 'tagNumber name type')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('type title animalId createdAt');


    
    // Combine and sort by date
    const recentActivity = [
        ...recentAnimals.map(animal => ({
            type: 'animal_added',
            data: {
                tagNumber: animal.tagNumber,
                name: animal.name,
                animalType: animal.type,
                photo: animal.photo
            },
            timestamp: animal.createdAt
        })),
        ...recentHealthRecords.map(record => ({
            type: 'health_record_added',
            data: {
                recordType: record.type,
                title: record.title,
                animal: record.animalId ? {
                    tagNumber: record.animalId.tagNumber,
                    name: record.animalId.name
                } : null
            },
            timestamp: record.createdAt
        }))
    ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
    
    // 5. Health Statistics
    const totalHealthRecords = await HealthRecord.countDocuments({ userId });
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const recordsThisMonth = await HealthRecord.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth }
    });


    
    
    // 6. Quick Actions Data
    const needsAttentionAnimals = await Animal.find({
        userId,
        status: { $in: ['Attention', 'Critical'] },
        isActive: true
    })
    .select('tagNumber name type status photo')
    .limit(3);
    
    return res.status(200).json(
        new ApiResponse(200, {
            animals: {
                total: totalAnimals,
                ...statusCounts
            },
            upcomingVaccinations: upcomingVaccinationsWithDays.map(record => ({
                id: record._id,
                animal: record.animalId ? {
                    _id: record.animalId._id,
                    tagNumber: record.animalId.tagNumber,
                    name: record.animalId.name,
                    type: record.animalId.type,
                    photo: record.animalId.photo,
                    status: record.animalId.status
                } : null,
                type: record.type,
                title: record.title,
                dueDate: record.nextDueDate,
                daysUntil: record.daysUntil || 0,
                status: record.animalId?.status
            })),
            alerts: {
                overdueCount,
                needsAttentionCount: statusCounts.needAttention + statusCounts.critical
            },
            recentActivity,
            statistics: {
                totalHealthRecords,
                recordsThisMonth
            },
            needsAttention: needsAttentionAnimals
        }, "Dashboard data fetched successfully")
    );
});

export { getDashboardOverview };