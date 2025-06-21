import React, { useState, useEffect } from 'react';
import '../css/ArticleDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ArticleDetails() {
    const { trackingId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/pdf/${trackingId}`)
            .then(res => {
                console.log("Makale verisi:", res.data);

                if (res.data && Object.keys(res.data).length > 0) {
                    setArticle(res.data);
                } else {
                    navigate("/notFoundPage");
                }
            })
            .catch(err => {
                console.error("Makale yüklenirken hata:", err);
                navigate("/notFoundPage");
            });
    }, [trackingId, navigate]);

    return (
        <div className="pdf-container">
            {article ? (
                <iframe
                    id="pdf-viewer"
                    src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/pdf/${article.trackingId}`}
                    frameBorder="0"
                    onError={() => {
                        console.error("PDF yüklenirken hata oluştu");
                        navigate("/notFoundPage");
                    }}
                ></iframe>
            ) : <p>Makale yükleniyor...</p>}
        </div>
    );
}

export default ArticleDetails;
