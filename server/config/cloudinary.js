const cloudinary = require("cloudinary").v2;

// Centralized Cloudinary configuration.
// Expects env vars:
// - CLOUDINARY_CLOUD_NAME
// - CLOUDINARY_API_KEY
// - CLOUDINARY_API_SECRET

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

function assertCloudinaryEnv() {
  const missing = [];
  if (!CLOUDINARY_CLOUD_NAME) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!CLOUDINARY_API_KEY) missing.push("CLOUDINARY_API_KEY");
  if (!CLOUDINARY_API_SECRET) missing.push("CLOUDINARY_API_SECRET");

  if (missing.length) {
    throw new Error(
      `Missing required Cloudinary environment variables: ${missing.join(", ")}`
    );
  }
}

assertCloudinaryEnv();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

