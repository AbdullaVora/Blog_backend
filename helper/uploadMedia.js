const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,    
});
/**
 * Uploads a Base64 media string (image/video/gif) to Cloudinary
 * @param {string} base64 - The full base64 string (including data:mime prefix)
 * @param {string} folder - Cloudinary folder name (optional)
 * @returns {Promise<object>} Cloudinary upload response
 */
const uploadMedia = async (base64, folder = 'Blogs') => {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: 'auto', // auto-detect image, video, etc.
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
};

module.exports = { uploadMedia };
