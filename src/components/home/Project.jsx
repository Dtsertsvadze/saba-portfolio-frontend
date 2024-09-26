import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Project = ({ name, id }) => {
  const linkTo = name.toLowerCase() === "home" ? "/" : `/project/${id}`;

  return (
    <NavLink to={linkTo} className="project-link">
      <div className="project-item">{name}</div>
    </NavLink>
  );
};

Project.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Project;
