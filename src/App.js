import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const RegisterCustomer = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    details: "",
    tel: "",
    email: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateForm = () => {
    const { firstName, lastName, tel, email, details, image } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telPattern = /^\d+$/;

    // File validation (optional)
    if (image && !["image/jpeg", "image/png"].includes(image.type)) {
      setError("Only JPEG or PNG images are allowed.");
      return false;
    }

    // Validate form fields
    if (!firstName || !lastName || !tel || !email || !details || !image) {
      setError("All fields are required, including image upload.");
      return false;
    }
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!telPattern.test(tel)) {
      setError("Telephone must contain only numbers.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("details", formData.details);
    data.append("tel", formData.tel);
    data.append("email", formData.email);
    data.append("image", formData.image); // Attach the image file

    setLoading(true);
    try {
      await axios.post("https://kwaserver.vercel.app/add", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct headers
        },
      });
      alert("Customer registered successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        details: "",
        tel: "",
        email: "",
        image: null,
      });
      setError(null);
    } catch (error) {
      console.error("Error registering customer:", error);
      setError("Error registering customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register As a New Church Member</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="details">Member or Visitor:</label>
        <input
          type="text"
          placeholder="Simply Say I am a visitor or Member"
          id="details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          required
        />

        <label htmlFor="tel">Telephone:</label>
        <input
          type="tel"
          id="tel"
          name="tel"
          value={formData.tel}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="image">Upload Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default RegisterCustomer;
