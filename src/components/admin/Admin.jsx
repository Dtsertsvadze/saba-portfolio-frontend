import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Item from "./Item";
import "./Admin.css";

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const baseUrl = "https://api.sabagorgodze.com";

  const checkTokenValidity = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/verify-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token is invalid or expired");
      }

      const data = await response.json();
      console.log("Token is valid:", data);
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const fetchCategories = async (token) => {
    try {
      const response = await fetch(`${baseUrl}/api/projects`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCategories(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/api/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) throw new Error("Failed to add category");
      setNewCategoryName("");
      fetchCategories(token);
    } catch (error) {
      setError("Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete category");
      fetchCategories(token);
      navigate("/admin");
    } catch (error) {
      setError("Error deleting category");
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${baseUrl}/api/projects/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editingCategory.name }),
        }
      );
      if (!response.ok) throw new Error("Failed to update category");
      setEditingCategory(null);
      fetchCategories(token);
    } catch (error) {
      setError("Error updating category");
    }
  };

  const handleEditProject = (itemId) => {
    navigate(`/admin/edit/${itemId}`);
  };

  const handleDeleteProject = (itemId) => {
    navigate(`/admin/delete/${itemId}`);
  };

  const logOutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">Admin</h1>
        <button className="logout" onClick={logOutHandler}>
          Log Out
        </button>
      </div>
      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="categories-section">
        <h2 className="section-title">Projects</h2>
        <form onSubmit={handleAddCategory} className="add-category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Project Name..."
            className="input-field"
            required
          />
          <button type="submit" className="add-button">
            Add Project
          </button>
        </form>
        <Link to="/admin/upload" className="upload-link">
          Upload New Image
        </Link>
        <ul className="categories-list">
          {categories.map((category) => (
            <li key={category.id} className="category-item">
              {editingCategory && editingCategory.id === category.id ? (
                <form
                  onSubmit={handleEditCategory}
                  className="edit-category-form"
                >
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                  <button type="submit" className="save-button">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="category-content">
                  <span>{category.name}</span>
                  <div className="category-actions">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <h3 className="projects-title">Images:</h3>
              <div className="projects-list">
                {category.projects?.map((item) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    description={item.description}
                    imageUrl={item.imagePath}
                    onEdit={() => handleEditProject(item.id)}
                    onDelete={() => handleDeleteProject(item.id)}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
