import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DeleteItemPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({ description: '', imagePath: '' });

  const baseUrl = "https://sabagorgodze.com";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/items/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [projectId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/items/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "content-type": "application/json"
        }
      });
      if (!response.ok) throw new Error('Failed to delete item');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="delete-item-page">
      <h1>Delete Item</h1>
      <p>Are you sure you want to delete this item?</p>
      <div className="item-details">
        <img src={item.imagePath} alt={item.description} />
        <p>{item.description}</p>
      </div>
      <div className="button-group">
        <button onClick={handleDelete} className="delete-button">Yes, Delete</button>
        <button onClick={() => navigate('/admin')} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteItemPage;