// src/components/StarRater.jsx
import React, { useState, useEffect } from 'react';
import ReactStars from 'react-rating-stars-component';
import api from '../api/axios';

const StarRater = ({ activityId, initialValue = 0, readOnly = false, onRate }) => {
  const [rating, setRating] = useState(Number(initialValue));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRating(Number(initialValue));
  }, [initialValue]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (readOnly || loading) return;
    setLoading(true);

    try {
      await api.post('/api/activity-ratings', {
        activity_id: activityId,
        rating: rating,
      });
      onRate?.(rating);
    } catch (error) {
      console.error("Error al enviar la valoración:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="star-rater">
      <ReactStars
        count={5}
        value={rating}
        onChange={handleRatingChange}
        size={24}
        activeColor="#ffd700"
        edit={!readOnly}
      />
      {!readOnly && (
        <button
          className="btn btn-primary mt-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar valoración'}
        </button>
      )}
    </div>
  );
};

export default StarRater;
