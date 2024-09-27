import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditItemPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({ description: "", imagePath: "" });
  const [newImage, setNewImage] = useState(null); // For handling new image upload
  const [previewUrl, setPreviewUrl] = useState(""); // For handling image preview


  const baseUrl = "https://sabagorgodze.com";
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/items/${projectId}`
        );
        if (!response.ok) throw new Error("Failed to fetch item");
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const formData = new FormData();
    formData.append("description", item.description);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await fetch(
        `http://localhost:5146/api/items/${projectId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
      if (!response.ok) throw new Error("Failed to update item");
      console.log("Item updated successfully"); // Debugging log
      navigate("/admin");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="edit-item-page">
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={item.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newImage">Upload New Image:</label>
          <input
            type="file"
            id="newImage"
            name="newImage"
            onChange={handleImageChange}
          />
        </div>
        <div className="image-preview">
          <img src={previewUrl || item.imagePath} alt={item.description} />
        </div>
        <div className="button-group">
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
          >
            Update Item
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemPage;
