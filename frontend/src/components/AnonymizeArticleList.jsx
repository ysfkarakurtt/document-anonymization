import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import Article from './Article';
function AnonymizeArticleList() {

    const [anonymizedArticles, setAnonymizedArticles] = useState([]);

    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/anonymized/`)
        .then(res => {
            console.log(res.data)
            setAnonymizedArticles(res.data);
        })
        .catch(err => console.log(err));

    return (
        <div>
            <div className="container">
                <div className="row" id='container-articles'>
                    {anonymizedArticles.map((article, id) => (
                        <Article key={id} article={articleId} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AnonymizeArticleList