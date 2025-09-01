// pages/api/add-school.js
import pool from "../../lib/db";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false, // We use formidable
  },
};

// Configure Cloudinary (reads from CLOUDINARY_URL automatically)
cloudinary.config({
  secure: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const { name, address, city, state, contact, email_id, website } = fields;
        const imageFile = files.image?.[0];

        let imageUrl = null;

        if (imageFile) {
          // Upload to Cloudinary
          const uploadRes = await cloudinary.uploader.upload(imageFile.filepath, {
            folder: "schools", // optional folder in Cloudinary
            resource_type: "image",
          });
          imageUrl = uploadRes.secure_url;
        }

        // Save school data + Cloudinary image URL into MySQL
        await pool.query(
          "INSERT INTO schools (name, address, city, state, contact, image, email_id, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [name, address, city, state, contact, imageUrl, email_id, website || null]
        );

        res.status(200).json({ success: true, message: "School added successfully" });
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
