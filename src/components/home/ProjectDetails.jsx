import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const { id } = useParams();

  const baseUrl = "https://api.sabagorgodze.com";
  const CACHE_KEY = `project_cache_${id}`;
  const CACHE_DURATION = 1000 * 60 * 60;

  const fetchProject = async () => {
    try {
      setLoading(true);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setProject(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached data", e);
        }
      }

      const response = await fetch(`${baseUrl}/api/projects/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      const data = await response.json();
      setProject(data);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(err.message);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data } = JSON.parse(cachedData);
          setProject(data);
        } catch (e) {
          console.error("Failed to parse cached data", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsGridView(true);
      } else {
        setIsGridView(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? project.projects.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === project.projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleGridView = () => {
    setIsGridView((prevState) => !prevState);
  };

  const handleImageClick = (index) => {
    if (window.innerWidth > 767) {
      setCurrentIndex(index);
      setIsGridView(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No items found</div>;

  return (
    <div className="project-details">
      <button className="grid-toggle-button" onClick={toggleGridView}>
        {isGridView ? "Single View" : "Show All Images"}
      </button>
      <div className={`image-grid ${isGridView ? "grid-view" : "single-view"}`}>
        {!isGridView && (
          <React.Fragment>
            <button className="nav-button" onClick={handlePrev}>
              ❮
            </button>
            <button className="nav-button" onClick={handleNext}>
              ❯
            </button>
          </React.Fragment>
        )}
        {project.projects.map((item, index) => (
          <img
            key={item.id}
            src={item.imagePath}
            alt={item.description}
            className={`project-image ${
              index === currentIndex && !isGridView ? "active" : ""
            }`}
            style={{
              opacity: isGridView || index === currentIndex ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              cursor: isGridView ? "pointer" : "default",
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
