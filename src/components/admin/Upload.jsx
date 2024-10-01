import React, { useState, useEffect } from "react";
import "./Upload.css";
import { Link, useNavigate } from "react-router-dom";

const Upload = () => {
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const baseUrl = "https://api.sabagorgodze.com";
  const CACHE_KEY = "upload_categories_cache";
  const CACHE_DURATION = 1000 * 60 * 60;

  const fetchCategories = async () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCategories(data);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached data", e);
        }
      }

      const response = await fetch(`${baseUrl}/api/projects`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("image", image);

    try {
      const response = await fetch(`${baseUrl}/api/items`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("Upload successful!");
        localStorage.removeItem(CACHE_KEY);
        navigate("/admin");
      } else {
        alert("Failed to upload.");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("An error occurred while uploading.");
    }

    setDescription("");
    setCategoryId("");
    setImage(null);
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Image</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description:
          </label>
          <input
            className="form-input"
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="categoryId">
            Category:
          </label>
          <select
            className="form-select"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="image">
            Image:
          </label>
          <input
            className="form-input"
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <div className="action-buttons">
          <button className="upload-button" type="submit">
            Upload
          </button>
          <Link to="/admin" className="back-button" type="submit">
            Back to Admin Panel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Upload;
