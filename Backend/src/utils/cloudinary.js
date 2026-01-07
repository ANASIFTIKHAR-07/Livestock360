import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


console.log("Cloudinary ENV:", {
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    key: !!process.env.CLOUDINARY_API_KEY,
    secret: !!process.env.CLOUDINARY_API_SECRET,
  });
  
const uploadOnCloudinary = async (localFilePath) => {    
    try {
        if (!localFilePath) return null;
        
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "livestock360/animals" // Organize in folders
        });
        
        // File uploaded successfully, delete local temp file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        
        // Clean up temp file if exists
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;   
    }
};

export { uploadOnCloudinary };