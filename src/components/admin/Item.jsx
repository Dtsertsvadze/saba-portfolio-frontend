import React from "react";
import PropTypes from "prop-types";
import "./Item.css";

const Item = ({ description, imageUrl, onDelete, onEdit }) => {
  return (
    <div className="project">
      <img src={imageUrl} alt={description} className="project-image" />
      <p className="project-description">{description}</p>
      <div className="project-actions">
        <button onClick={onEdit} className="edit-button">Edit</button>
        <button onClick={onDelete} className="delete-button">Delete</button>
      </div>
    </div>
  );
};

Item.propTypes = {
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default Item;