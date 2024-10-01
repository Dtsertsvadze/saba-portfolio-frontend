import React, { useEffect, useState, useCallback } from "react";
import "./Home.css";

const Home = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 767);

  const baseUrl = "https://api.sabagorgodze.com";
  const CACHE_KEY = "home_images_cache";
  const CACHE_DURATION = 1000 * 60 * 60;

  const fetchHomeImages = async () => {
    try {
      setIsLoading(true);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setImages(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached data", e);
        }
      }

      const response = await fetch(`${baseUrl}/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const projects = await response.json();

      const homeProject = projects.find(
        (project) => project.name.toLowerCase() === "home"
      );
      if (!homeProject) throw new Error("Home project not found");

      const imagesResponse = await fetch(
        `${baseUrl}/api/projects/${homeProject.id}`
      );
      if (!imagesResponse.ok) throw new Error("Failed to fetch images");
      const imagesData = await imagesResponse.json();

      setImages(imagesData.projects);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: imagesData.projects,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      setError(error.message);

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data } = JSON.parse(cachedData);
          setImages(data);
        } catch (e) {
          console.error("Failed to parse cached data", e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeImages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const transitionToNextImage = useCallback(() => {
    if (images.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setNextIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 1000);
    }
  }, [images.length]);

  useEffect(() => {
    let transitionInterval;
    if (images.length > 1 && isPlaying && !isMobileView) {
      transitionInterval = setInterval(transitionToNextImage, 5000);
    }
    return () => clearInterval(transitionInterval);
  }, [transitionToNextImage, images.length, isPlaying, isMobileView]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (images.length === 0) {
    return <div className="no-images">No images available</div>;
  }

  return (
    <div className="home">
      <div className="content">
        <div className={`image-container ${isMobileView ? "mobile-view" : ""}`}>
          {isMobileView ? (
            images.map((image) => (
              <img
                key={image.id}
                src={image.imagePath}
                alt={image.description || "Home image"}
                className="home-image"
              />
            ))
          ) : (
            <>
              <img
                key={`current-${images[currentIndex].id}`}
                src={images[currentIndex].imagePath}
                alt={images[currentIndex].description || "Current image"}
                className={`home-image ${
                  isTransitioning ? "fade-out" : "fade-in"
                }`}
              />
              {images.length > 1 && (
                <img
                  key={`next-${images[nextIndex].id}`}
                  src={images[nextIndex].imagePath}
                  alt={images[nextIndex].description || "Next image"}
                  className={`home-image ${
                    isTransitioning ? "fade-in" : "fade-out"
                  }`}
                />
              )}
            </>
          )}
          {!isMobileView && images.length > 1 && (
            <button className="play-pause-button" onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
