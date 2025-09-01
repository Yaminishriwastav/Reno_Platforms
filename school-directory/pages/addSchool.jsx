import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setMessage("");
    try {
      const form = new FormData();
      form.append("name", data.name);
      form.append("address", data.address);
      form.append("city", data.city);
      form.append("state", data.state);
      form.append("contact", data.contact);
      form.append("email_id", data.email_id);
      form.append("website", data.website || "");
      if (data.image && data.image[0]) form.append("image", data.image[0]);

      const res = await fetch("/api/add-school", { method: "POST", body: form });
      const out = await res.json();

      if (!res.ok) throw new Error(out?.error || "Failed to save");

      setMessage("✅ School added successfully.");
      reset();
    } catch (err) {
      setMessage("❌ " + (err.message || "Unexpected error"));
      console.error("AddSchool error:", err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Add School</h1>
        <nav className="nav">
          <Link href="/showSchools">View Schools</Link>
        </nav>
      </div>

      <form className="card" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="form-grid col2">
          <div>
            <label className="label">Name</label>
            <input className="input" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="err">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              {...register("email_id", {
                required: "Email required",
                pattern: { value: /[^@\s]+@[^@\s]+\.[^@\s]+/, message: "Invalid email" }
              })}
            />
            {errors.email_id && <p className="err">{errors.email_id.message}</p>}
          </div>
        </div>

        <div className="form-grid col2">
          <div>
            <label className="label">Address</label>
            <input className="input" {...register("address", { required: "Address required" })} />
            {errors.address && <p className="err">{errors.address.message}</p>}
          </div>

          <div>
            <label className="label">City</label>
            <input className="input" {...register("city", { required: "City required" })} />
            {errors.city && <p className="err">{errors.city.message}</p>}
          </div>
        </div>

        <div className="form-grid col2">
          <div>
            <label className="label">State</label>
            <input className="input" {...register("state", { required: "State required" })} />
            {errors.state && <p className="err">{errors.state.message}</p>}
          </div>

          <div>
            <label className="label">Contact (10 digits)</label>
            <input
              className="input"
              {...register("contact", {
                required: "Contact required",
                pattern: { value: /^\d{10}$/, message: "Enter 10 digits" }
              })}
            />
            {errors.contact && <p className="err">{errors.contact.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">Website (optional)</label>
          <input
            className="input"
            type="url"
            placeholder="https://example.com"
            {...register("website", {
              pattern: {
                value: /^https?:\/\/.+/i,
                message: "Enter a valid URL starting with http(s)"
              }
            })}
          />
          {errors.website && <p className="err">{errors.website.message}</p>}
        </div>

        <div>
          <label className="label">Image (JPG/PNG/WebP, max 2MB)</label>
          <input
            className="file"
            type="file"
            accept="image/*"
            {...register("image", { required: "Image required" })}
          />
          {errors.image && <p className="err">{errors.image.message}</p>}
        </div>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save School"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      {/* ✅ Styling */}
      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 40px auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .form-grid {
          display: grid;
          gap: 16px;
          margin-bottom: 16px;
        }
        .col2 {
          grid-template-columns: 1fr 1fr;
        }
        .label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }
        .input, .file {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .input:focus, .file:focus {
          border-color: #0070f3;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0,118,255,0.2);
        }
        .button {
          margin-top: 12px;
          background: #0070f3;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .button:hover {
          background: #0059c1;
        }
        .err {
          color: red;
          font-size: 13px;
          margin-top: 4px;
        }
        .message {
          margin-top: 12px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
