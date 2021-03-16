const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryController = {
  async upload(file, folder) {
    try {
      const folderPath = `${process.env.CLOUDINARY_ROOT_FOLDER_NAME}/${folder}`;
      const uploadOptions = {
        folder: folderPath,
        use_filename: true,
        resource_type: "auto",
      };
      const result = await cloudinary.v2.uploader.upload(
        file.path,
        uploadOptions
      );
      return {
        url: result.secure_url,
        publicID: result.public_id,
        fileName: result.original_filename,
      };
    } catch (error) {
      return {
        url: "",
        publicID: "",
        fileName: "",
      };
    }
  },
};

module.exports = cloudinaryController;
