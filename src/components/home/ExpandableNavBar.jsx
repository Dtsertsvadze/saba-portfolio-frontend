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

  const CACHE_KEY = "categories_cache";
  const CACHE_DURATION = 1000 * 60 * 60;
  const baseUrl = "https://api.sabagorgodze.com";

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
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();

      const homeCategoryIndex = data.findIndex(
        (category) => category.name.toLowerCase() === "home"
      );
      if (homeCategoryIndex !== -1) {
        const [homeCategory] = data.splice(homeCategoryIndex, 1);
        data.unshift(homeCategory);
      }

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      setCategories(data);
    } catch (error) {
      setError("Error fetching categories");

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data } = JSON.parse(cachedData);
          setCategories(data);
        } catch (e) {
          console.error("Failed to parse cached data", e);
        }
      }
    }
  };

  return (
    <div className={`navbar-links ${isOpen ? "open" : ""}`}>
      {categories.map((category) => (
        <Link
          to={
            category.name.toLowerCase() === "home"
              ? "/"
              : `/project/${category.id}`
          }
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
