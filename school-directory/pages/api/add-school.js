import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import pool from "@/lib/db";

export const config = {
  api: { bodyParser: false },
};

//  Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Form parse error" });

    try {
      // Handle image safely
      let imageUrl = null;
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;

        const upload = await cloudinary.uploader.upload(file.filepath, {
          folder: "schools",
        });

        imageUrl = upload.secure_url;
      }

      // ✅ Insert into MySQL
      const [result] = await pool.execute(
        `INSERT INTO schools 
         (name, address, city, state, contact, email_id, website, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fields.name,
          fields.address,
          fields.city,
          fields.state,
          fields.contact,
          fields.email_id,
          fields.website || "",
          imageUrl,
        ]
      );

      return res.status(200).json({ success: true, id: result.insertId });
    } catch (e) {
      console.error("DB/Cloudinary error:", e);
      return res.status(500).json({ error: e.message });
    }
  });
}
