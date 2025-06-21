import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Article from './Article'
function ArticleList() {

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/`)
            .then(res => {
                console.log(res.data)
                setArticles(res.data);
            })
            .catch(err => console.log(err));



        
    }, []);
    return (
                <div className="container">
                    <div className="row" id='container-articles'>
                        {articles.map((article, id) => (
                            <Article key={id} article={article} />
                        ))}
                    </div>
                </div>
        
    )
}

export default ArticleList