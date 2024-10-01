import React, { useEffect, useState } from "react";
import Project from "./Project";
import "./NavBar.css";
import { Link } from "react-router-dom";
import ExpandableNavBar from "./ExpandableNavBar";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const CACHE_KEY = "categories_cache";
  const CACHE_DURATION = 1000 * 60 * 60;

  useEffect(() => {
    fetchCategories();
  }, []);

  const baseUrl = "https://api.sabagorgodze.com";

  const fetchCategories = async () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setCategories(data);
          return;
        }
      }
      const response = await fetch(`${baseUrl}/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      setCategories(sortCategories(data));
    } catch (error) {
      setError("Error fetching categories");

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setCategories(sortCategories(data));
      }
    }
  };

  const sortCategories = (data) => {
    const homeCategoryIndex = data.findIndex(
      (category) => category.name.toLowerCase() === "home"
    );
    if (homeCategoryIndex !== -1) {
      const [homeCategory] = data.splice(homeCategoryIndex, 1);
      return [homeCategory, ...data];
    }
    return data;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar`}>
      <Link to={"/"} className="sidebar-header">
        SABA GORGODZE
      </Link>
      <div className="burger-icon" onClick={toggleSidebar}>
        ☰
      </div>
      <ExpandableNavBar isOpen={isOpen} onClick={toggleSidebar} />
      <div className="projects-wrapper">
        {categories.map((project) => (
          <Project name={project.name} id={project.id} key={project.id} />
        ))}
      </div>
      <Link to={"/about"} className="about-link">
        About/Contact
      </Link>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Sidebar;
