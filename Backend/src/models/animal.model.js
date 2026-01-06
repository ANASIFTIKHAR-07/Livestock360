import mongoose, {Schema} from "mongoose"

const animalSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index:true,
    },
    tagNumber: {
        type: String,
        required: [true, "Tag Number is required"],
        trim: true,
        index: true,
    },
    name: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        enum: {
            values: ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel', 'Other'],
            message: "{Value} is not valid animal type",
        },
        index: true,
    },
    breed: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: {
            values: ['Male', 'Female'],
            message: '{VALUE} is not a valid gender'
        }
    },
    birthDate: {
        type: Date,
        required: [true, "Birth date is required"],
        index: true
    },
    weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
    },
    photo: {
        type: String
    },
    status: {
        type: String,
        enum: ['Healthy', 'Attention', 'Critical', 'Unknown'],
        default: "Unknown",
        index: true,
    },
    notes: {
        type: String,
        maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    lastCheckupDate: {
        type: Date
    }
}, {timestamps: true});


// Virtual field to calculate age
animalSchema.virtual('age').get(function() {
    if (!this.birthDate) return null;
    
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return {
        years,
        months,
        totalMonths: years * 12 + months
    };
});


// Ensure virtuals are included when converting to JSON
animalSchema.set('toJSON', { virtuals: true });
animalSchema.set('toObject', { virtuals: true });

// Compound indexes for efficient queries
animalSchema.index({ userId: 1, type: 1 });
animalSchema.index({ userId: 1, status: 1 });
animalSchema.index({ userId: 1, isActive: 1 });
animalSchema.index({ userId: 1, createdAt: -1 });

// Text index for search functionality
animalSchema.index({ tagNumber: 'text', name: 'text' });

export const Animal = mongoose.model("Animal", animalSchema);