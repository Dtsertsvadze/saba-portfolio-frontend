import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ExpandableNavBar.css";
import PropTypes from "prop-types";

const ExpandableNavBar = ({ isOpen, onClick }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const baseUrl = "https://sabagorgodze.com";

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();

      const homeCategoryIndex = data.findIndex(
        (category) => category.name.toLowerCase() === "home"
      );
      if (homeCategoryIndex !== -1) {
        const [homeCategory] = data.splice(homeCategoryIndex, 1);
        data.unshift(homeCategory);
      }

      setCategories(data);
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  return (
    <div className={`navbar-links ${isOpen ? "open" : ""}`}>
      {categories.map((category) => (
        <Link
          to={category.name.toLowerCase() === "home" ? "/" : `/project/${category.id}`}
          key={category.id}
          className="nav-link"
          onClick={onClick}
        >
          {category.name}
        </Link>
      ))}
      <Link to="/about" className="nav-link" onClick={onClick}>
        About/Contact
      </Link>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

ExpandableNavBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

export default ExpandableNavBar;