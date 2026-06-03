const uploadCloudinary = require("../config/cloudinary");

// Admin-only: upload product images to Cloudinary.
// Route expects multipart/form-data with field name: `images`
// Example: images: [file1, file2]
// Response: { images: [url1, url2, ...] }
exports.uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image file is required",
      });
    }

    // NOTE: Promise-based upload below (upload_stream requires stream handling).

    const results = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = uploadCloudinary.uploader.upload_stream(
              {
                folder: "ecommerce-products",
                resource_type: "image",
                use_filename: true,
                unique_filename: true,
                overwrite: false,
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );

            stream.end(file.buffer);
          })
      )
    );

    const urls = results
      .filter((r) => r && r.secure_url)
      .map((r) => r.secure_url);

    if (!urls.length) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    return res.status(200).json({ success: true, images: urls });
  } catch (err) {
    next(err);
  }
};

