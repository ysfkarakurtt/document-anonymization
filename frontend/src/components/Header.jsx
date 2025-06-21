import React, { useState, useEffect } from 'react';
import '../css/Header.css';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activePage, setActivePage] = useState('');


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    useEffect(() => {
        setActivePage(window.location.pathname);
    }, [window.location.pathname]);

    const handleOutsideClick = (e) => {
        if (e.target.closest('.navbar') === null && isMenuOpen) {
            closeMenu();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isMenuOpen]);


    const getLinkClass = (path) => {
        return activePage === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <a className="navbar-brand" href="/" onClick={closeMenu}>
                    <img src="/icons/article.jpg" width="110" height="70" className="d-inline-block align-top" alt="Logo" />
                    <h3 id="navbar-header">Güvenli Belge Anonimleştirme</h3>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMenu}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                    aria-label="Toggle navigation"
                >
                    <span className={`navbar-toggler-icon ${isMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto mb-3">
                        <li className="nav-item">
                            <a className={getLinkClass('/')} href="/">Anasayfa</a>
                        </li>
                        <li className="nav-item">
                            <a className={getLinkClass('/editor')} href="/editor">Makaleler</a>
                        </li>
                        <li className="nav-item">
                            <a className={getLinkClass('/referee-add')} href="/referee-add">Hakem Ekle</a>
                        </li>
                        <li className="nav-item">
                            <a className={getLinkClass('/referee')} href="/referee">Hakem Sayfası</a>
                        </li>
                        <li className="nav-item">
                            <a className={getLinkClass('/status')} href="/status">Makale Durum Sorgulama</a>
                        </li>
                        <li className="nav-item">
                            <a className={getLinkClass('/logs')} href="/logs">Loglar</a>
                        </li>


                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Header;
