import React, { useEffect } from 'react';

export default function Toast({ id, message, bg, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className="toast show align-items-center text-white border-0 mb-2"
      role="alert"
      style={{ backgroundColor: bg, minWidth: '200px' }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={() => onClose(id)}
        />
      </div>
    </div>
  );
}
