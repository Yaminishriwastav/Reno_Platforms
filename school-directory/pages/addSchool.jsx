

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
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

      const res = await fetch("/api/add-school", {
        method: "POST",
        body: form,
      });

      const contentType = res.headers.get("content-type") || "";
      let out;
      if (contentType.includes("application/json")) {
        out = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || "Unexpected non-JSON response");
      }

      if (!res.ok) throw new Error(out?.error || "Failed to save");

      setMessage(" School added successfully.");
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
          <Link href="/showSchools">View Schools🏫</Link>
        </nav>
      </div>

      <form
        className="card"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="form-grid col2">
          <div>
            <label>Name</label>
            <input {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="err">{errors.name.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              {...register("email_id", { required: "Email required" })}
            />
            {errors.email_id && <p className="err">{errors.email_id.message}</p>}
          </div>
        </div>

        <div className="form-grid col2">
          <div>
            <label>Address</label>
            <input {...register("address", { required: "Address required" })} />
            {errors.address && <p className="err">{errors.address.message}</p>}
          </div>
          <div>
            <label>City</label>
            <input {...register("city", { required: "City required" })} />
            {errors.city && <p className="err">{errors.city.message}</p>}
          </div>
        </div>

        <div className="form-grid col2">
          <div>
            <label>State</label>
            <input {...register("state", { required: "State required" })} />
            {errors.state && <p className="err">{errors.state.message}</p>}
          </div>
          <div>
            <label>Contact</label>
            <input
              {...register("contact", {
                required: "Contact required",
                pattern: { value: /^\d{10}$/, message: "10 digits only" },
              })}
            />
            {errors.contact && <p className="err">{errors.contact.message}</p>}
          </div>
        </div>

        <div>
          <label>Website</label>
          <input type="url" {...register("website")} />
        </div>

        <div>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image required" })}
          />
          {errors.image && <p className="err">{errors.image.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn">
          {isSubmitting ? "Saving…" : "Save School"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .form-grid {
          display: grid;
          gap: 16px;
          margin-bottom: 16px;
        }
        .col2 {
          grid-template-columns: 1fr 1fr;
        }
        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }
        input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        input:focus {
          border-color: #4f46e5;
          outline: none;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }
          
        .btn {
          display: inline-block;
          margin-top: 12px;
          background: #4f46e5;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          text-align: center;
          transition: background 0.2s ease;
          text-decoration: none; /* important for Link */
        }
        .btn:hover {
          background: #3730a3;
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
