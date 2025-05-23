import React from 'react';
import '../assets/css/footer.css';

export default function Footer() {
  return (
    <footer className="footer-pro">
      <div className="footer-container">
        <div className="footer-social">
          <i className="bi bi-facebook"></i>
          <i className="bi bi-twitter-x"></i>
          <i className="bi bi-instagram"></i>
          <i className="bi bi-github"></i>
        </div>
        <p className="footer-copy">© 2025 PetConnect — Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
