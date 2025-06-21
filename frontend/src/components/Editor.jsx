import React, { useState } from 'react';
import ArticleList from './ArticleList';
import '../css/Editor.css';
import AnonymizeArticleList from './AnonymizeArticleList';

function Editor() {
  const [articleType, setArticleType] = useState('normal');

  const handleArticleTypeChange = (e) => {
    setArticleType(e.target.value);
  };

  return (
    <div className='container'>
      <div className='filter-row'>
        <select name="article-type" onChange={handleArticleTypeChange} value={articleType}>
          <option value="normal">Normal Makaleler</option>
          <option value="anonymized">Anonimleşmiş Makaleler</option>
        </select>
      </div>
      <div>
        {articleType === 'normal' ? <ArticleList /> : <AnonymizeArticleList />}
      </div>
    </div>
  );
}

export default Editor;
