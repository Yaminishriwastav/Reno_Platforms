// pages/api/addSchool.js
import pool from "../../lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const { name, address, city, state, contact, email_id, website } = fields; // ✅ website included
        const imageFile = files.image[0];

        const uploadDir = path.join(process.cwd(), "public", "schoolImages");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const imagePath = path.join(uploadDir, imageFile.originalFilename);
        fs.renameSync(imageFile.filepath, imagePath);

        const imageUrl = `/schoolImages/${imageFile.originalFilename}`;

        
        await pool.query(
          "INSERT INTO schools (name, address, city, state, contact, image, email_id, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [name, address, city, state, contact, imageUrl, email_id, website || null]
        );

        res.status(200).json({ success: true, message: "School added successfully" });
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
