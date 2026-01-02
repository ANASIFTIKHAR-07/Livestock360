import mongoose, { Schema } from "mongoose";

const healthRecordSchema = new Schema(
    {
        animalId: {
            type: Schema.Types.ObjectId,
            ref: 'Animal',
            required: [true, "Animal ID is required"],
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            required: [true, "Record type is required"],
            enum: {
                values: ['Vaccination', 'Treatment', 'Checkup', 'Deworming', 'Surgery', 'Other'],
                message: '{VALUE} is not a valid record type'
            },
            index: true
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"]
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
            index: true
        },
        nextDueDate: {
            type: Date,
            index: true
        },
        veterinarian: {
            type: String,
            trim: true
        },
        cost: {
            type: Number,
            min: [0, "Cost cannot be negative"]
        },
        medicine: {
            type: String,
            trim: true
        },
        dosage: {
            type: String,
            trim: true
        },
        photo: {
            type: String  // Cloudinary URL for receipt/document
        },
        status: {
            type: String,
            enum: ['Completed', 'Scheduled', 'Overdue', 'Cancelled'],
            default: 'Completed',
            index: true
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, "Notes cannot exceed 1000 characters"]
        }
    },
    { 
        timestamps: true 
    }
);


// Virtual to calculate days until next due date
healthRecordSchema.virtual('daysUntilDue').get(function() {
    if (!this.nextDueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(this.nextDueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
        days: diffDays,
        isOverdue: diffDays < 0,
        isDueToday: diffDays === 0,
        isDueSoon: diffDays > 0 && diffDays <= 7
    };
});

// Virtual to check if record is overdue
healthRecordSchema.virtual('isOverdue').get(function() {
    if (!this.nextDueDate) return false;
    return new Date() > new Date(this.nextDueDate) && this.status === 'Scheduled';
});

// Enable virtuals in JSON/Object conversion
healthRecordSchema.set('toJSON', { virtuals: true });
healthRecordSchema.set('toObject', { virtuals: true });

// Compound indexes for efficient queries
healthRecordSchema.index({ animalId: 1, date: -1 });
healthRecordSchema.index({ userId: 1, nextDueDate: 1 });
healthRecordSchema.index({ userId: 1, type: 1 });
healthRecordSchema.index({ nextDueDate: 1, status: 1 });


// Middleware to update animal's lastCheckupDate when health record is created
healthRecordSchema.post('save', async function(doc) {
    try {
        const Animal = mongoose.model('Animal');
        await Animal.findByIdAndUpdate(doc.animalId, {
            lastCheckupDate: doc.date
        });
    } catch (error) {
        console.error('Error updating animal lastCheckupDate:', error);
    }
});

export const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
