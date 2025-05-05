import React from 'react';

export default function Toast({ id, message, bg, onClose }) {
  return (
    <div
      className="toast show text-white mb-2"
      style={{ background: bg, minWidth: 250 }}
    >
      <div className="d-flex align-items-center">
        <div className="toast-body pe-2">{message}</div>

        {/* botón de cierre que NO recarga nada */}
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
          onClick={(e) => {
            e.preventDefault();   // bloquea navegaciones fantasma
            onClose(id);
          }}
        />
      </div>
    </div>
  );
}
