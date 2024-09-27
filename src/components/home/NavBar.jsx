import React, { useEffect, useState } from "react";
import Project from "./Project";
import "./NavBar.css";
import { Link } from "react-router-dom";
import ExpandableNavBar from "./ExpandableNavBar";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const baseUrl = "https://sabagorgodze.com";

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      
      const homeCategoryIndex = data.findIndex(category => category.name.toLowerCase() === "home");
      if (homeCategoryIndex !== -1) {
        const [homeCategory] = data.splice(homeCategoryIndex, 1);
        data.unshift(homeCategory);
      }

      setCategories(data);
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar`}>
      <Link to={"/"} className="sidebar-header">SABA GORGODZE</Link>
      <button className="burger-icon" onClick={toggleSidebar}>
        ☰
      </button>
      <ExpandableNavBar isOpen={isOpen} onClick={toggleSidebar}/>
      <div className="projects-wrapper">
        {categories.map((project) => (
          <Project name={project.name} id={project.id} key={project.id} />
        ))}
      </div>
      <Link to={"/about"} className="about-link">About/Contact</Link>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Sidebar;