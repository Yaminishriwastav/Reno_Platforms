// pages/api/get-schools.js
import pool from "@/lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM schools");
    res.status(200).json(rows); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
