import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';
import { FaExclamationTriangle } from 'react-icons/fa';

function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-message">
                <FaExclamationTriangle className="icon" />
                <p>Üzgünüz, aradığınız sayfa bulunamadı!</p>
                <Link to="/">Anasayfaya Dön</Link>
            </div>
        </div>
    );
}

export default NotFound;
