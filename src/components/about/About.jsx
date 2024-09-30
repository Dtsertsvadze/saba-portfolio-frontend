import React from "react";
import "./About.css";
import profileImage from "../../assets/saba.jpg";

import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <div className="about-content">
          <p>
            <img
              src={profileImage}
              alt="Saba Gorgodze"
              className="profile-image"
            />
            <span className="title">Saba Gorgodze</span> (Tbilisi, 1995) lives
            and works in Tbilisi, Georgia. He studied photography at Ilia State
            University, where he honed his skills in analog photography, his
            primary medium of artistic expression.
          </p>
          <p>
            Gorgodze's creative process is marked by long periods of reflection
            and observation, often spanning years before he picks up the camera.
            His subjects are chosen randomly, with material collected over
            extended periods. The artist then revisits and revises this amassed
            content, weaving it into series unified by conceptual threads born
            from his open approach to seeing.
          </p>
          <p>
            His photographs are a blend of raw and naturally refined aesthetics,
            frequently obscuring the subject in favor of ideas and concepts
            expressed through lines and shadows. By choosing black and white,
            Gorgodze opens the door to a degree of abstraction, infusing his
            subjects with alternative meanings and forms, transforming them into
            unidentifiable yet familiar, and at times uncanny, visuals.
          </p>
          <p>
            Introspection and personal growth are as crucial to{" "}
            <Link to={"/admin"} className="admin-link">
              Saba Gorgodze's{" "}
            </Link>
            creative process as capturing and revising images. He views himself
            as a conduit, constantly striving to maintain and expand his
            openness to seeing all that is to be seen and brought into focus.
            Through daily interactions with subjects and objects, Gorgodze
            accesses an unadulterated vision of the world around him, informing
            and sustaining his works.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
