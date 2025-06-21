import React, { useState } from 'react';
import axios from 'axios';
import '../css/Article.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Article({ article }) {
    const { trackingId, title, authorEmail, anonymizedPdf } = article;
    const [status, setStatus] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const openArticleInNewTab = () => {
        if (trackingId) {
            window.open(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/pdf/${trackingId}`, "_blank", "noopener,noreferrer");
        }
    };
    
    const openAnonymizedArticleInNewTab = () => {
        if (trackingId) {
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/anonymized/pdf/${trackingId}`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };


    const anonymizeArticle = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/anonymize/${trackingId}`);

            if (response.data) {
                console.log(response.data);
                setStatus(response.data.message || "Anonimleştirme başarılı.");
                navigate(0);
            } else {
                setStatus("Anonimleştirme sırasında bir hata oluştu.");
            }
        } catch (error) {
            console.error("Anonimleştirme hatası:", error);
            setStatus("Bir hata oluştu.");
        }
    };

    const openArticleOperation = () => {
        navigate(`/article-operation/${trackingId}`);
    };

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 mb-5">
            <div className="card-article h-100">
                <img src="/icons/article.jpg" className="card-img-top" alt={title} />
                <div className="card-body">
                    <h5 className="card-article-title">{title}</h5>
                </div>
                <div className="list-group-article-detail list-group-flush">
                    <div className="list-group-item">
                        <strong>Yazar Email:</strong> {authorEmail}
                    </div>
                    <div className="list-group-item">
                        <strong>Makale ID:</strong> {trackingId}
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                    {location.pathname === "/editor" ? (
                        <button type="button" className="btn btn-secondary" onClick={openArticleOperation}>
                            Makale İşlemleri
                        </button>
                    ) : (
                        <>
                            <button type="button" className="btn btn-danger" id="btn-go-to-article" onClick={openArticleInNewTab}>
                                Makaleye Git
                            </button>
                            {anonymizedPdf ? (
                                <button type="button" className="btn btn-primary" id="btn-go-to-anonymize-article" onClick={openAnonymizedArticleInNewTab}>
                                    Anonim Makaleye Git
                                </button>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={anonymizeArticle}>
                                    Anonimleştir
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            <p>{status}</p>
        </div>
    );
}

export default Article;
