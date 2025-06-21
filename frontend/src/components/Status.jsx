import React, { useState } from 'react'
import '../css/Status.css';
import axios from 'axios';
function Status() {
    const [trackingId, settrackingId] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [status, setStatus] = useState('');
    const [refereeComments, setRefereeComments] = useState('');
    const [flag, setFlag] = useState(false);
    const [editorMessage, setEditorMessage] = useState('');



    const openArticleInNewTab = () => {
        if (trackingId) {
            window.open(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/pdf/${trackingId}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!trackingId) {
            setErrorMessage("Makale takip numarası gereklidir.");
            setTimeout(() => setErrorMessage(false), 3000);
            return;
        }

        try {

            const articleRes = await axios.get(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/status/${trackingId}`,
                { params: { authorEmail: email } }
            );

            console.log(articleRes);
            setStatus(articleRes.data.status);
            setFlag(true);

            try {
                const refereeRes = await axios.get(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/referee-by-articleId`,
                    { params: { articleId: trackingId } }
                );
                setRefereeComments(refereeRes.data.comments);
            } catch (err) {
                console.error("Atanan hakemi getirme hatası:", err);
            }

            try {
                const log = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/article/update`,
                    { trackingId, editorMessage }
                );

                alert("Başarıyla gönderildi.")
            } catch (error) {
                console.error("Editor gönderilen mesaj güncelleme hatası:", error);
            }

        } catch (err) {
            console.error("Makale durum sorgulama hatası:", err);
            setErrorMessage("Makale veya E-Posta Yanlış.");
            setTimeout(() => setErrorMessage(false), 3000);
        }
    };


    const handleArticleAdd = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!validateForm()) return;

        if (!file) {
            setFileError(true);
            setTimeout(() => setFileError(false), 3000);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("pdf", file);
            formData.append("title", articleName);
            formData.append("authorEmail", email);
            const uploadRes = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTrackingId(uploadRes.data.trackingId);


            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/users/create`, {
                name: author, email, role: "author"
            });

            try {
                const log = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/logs/create`, {
                    message: "Editöre Makale geldi.",
                    trackingId: trackingId,
                });
                console.log(log.data);
            } catch (error) {
                console.log(error);
            }
            setAddedArticle(true);
            setTimeout(() => setAddedArticle(false), 3000);

            setName('');
            setAuthor('');
            setEmail('');
            setArticleName('');
            setFilePreview(null);
            setFile(null);
            setSubmitted(false);
        } catch (err) {
            console.error("Makale ekleme hatası:", err);
        }
    };
    return (
        <div className='container'>
            <div className='card'>
                <h2>Makale Durumu Sorgulama</h2>
                <form onSubmit={handleSubmit}>

                    <div className='inputs'>
                        <div className="input">
                            <div className="icon">
                                <i className="fa-regular fa-id-card fa-sm"></i>
                            </div>
                            <input
                                type="text"
                                placeholder='Makale id giriniz'
                                value={trackingId}
                                onChange={e => settrackingId(e.target.value)}
                                required
                            />

                        </div>

                        <div className="input">
                            <div className="icon">
                                <i className="fa-solid fa-envelope fa-sm"></i>
                            </div>
                            <input
                                type="email"
                                placeholder='Yazar E-Posta giriniz'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <div className='submit-container'>
                        <button className='submit'>
                            Ara
                        </button>
                    </div>
                </form>

                {errorMessage && <div className='alert alert-danger text-center'>{errorMessage}</div>}
                {flag == true ?
                    <div className="anonymized-article-detail">
                        <h4>Gönderilen Makale</h4>
                        <div className="row">
                            Makale ID: {trackingId}
                            <button className='btn btn-primary' onClick={openArticleInNewTab}>Makele incele</button>
                        </div>
                        <div>
                            Durum: {status}
                        </div>
                        <h4 >Hakem Yorumu </h4>
                        <div className="row">
                            <div className="form-group">

                                <textarea className="form-control" id="exampleFormControlTextarea1"
                                    placeholder='Hakem yorumunu giriniz'
                                    value={refereeComments ? refereeComments : "Henüz hakem yorum yapmadı."} onChange={e => setRefereeComments(e.target.value)}
                                    rows="3" readOnly></textarea>
                            </div>

                        </div>

                        <h4 >Editöre Mesaj </h4>
                        <div className="row">
                            <div className="form-group">

                                <textarea className="form-control" id="exampleFormControlTextarea2"
                                    placeholder='Editöre mesaj giriniz.'
                                    onChange={e => setEditorMessage(e.target.value)}
                                    rows="3" ></textarea>
                            </div>

                        </div>
                        <div>
                            <button className='btn btn-success' onClick={handleSubmit}>Gönder</button>
                        </div>
                    </div> : ''}
                {
                    status == 'revise' ? (<div className='upload-form'>
                        <div className='form-container-add-article'>
                            <h2 className='page-title-article-management'>Makale Ekle</h2>
                            <form onSubmit={handleArticleAdd}>
                                {fileError && <div className='alert alert-danger'>Lütfen Makale Dosyasını Seçiniz.</div>}
                                {addedArticle && <div className='alert alert-success'>Makale Başarıyla Eklendi.</div>}
                                {flag == true ? <div className='alert alert-success'>Makale Id : {trackingId}</div> : ''}

                                <div className='file-upload'>
                                    {filePreview ? <p>{filePreview}</p> : <div className='file-placeholder'>Dosya seçilmedi</div>}
                                    <label className='upload-btn' htmlFor='file-upload'>Dosya Seç</label>
                                    <input id='file-upload' type='file' onChange={handleFileUpload} />
                                </div>

                                <div className='form-group mb-4 flex-row'>
                                    <div className='add-article-form-icon'><BiSolidUserDetail /></div>
                                    <input type='text' className={`form - control ${getValidationClass("author")}`}
                                        value={author} onChange={(e) => setAuthor(e.target.value)}
                                        placeholder='Yazar Adı, Soyadı*' required />
                                    <div className='invalid-feedback'>Bu alan boş bırakılamaz.</div>
                                </div>

                                <div className='form-group mb-4 flex-row'>
                                    <div className='add-article-form-icon'><MdOutlineArticle /></div>
                                    <input type='text' className={`form - control ${getValidationClass("articleName")}`}
                                        value={articleName} onChange={(e) => setArticleName(e.target.value)}
                                        placeholder='Makale Adı*' required />
                                    <div className='invalid-feedback'>Bu alan boş bırakılamaz.</div>
                                </div>

                                <div className='form-group mb-3 flex-row'>
                                    <div className='add-article-form-icon'><MdEmail /></div>
                                    <input type='email' className={`form - control ${getValidationClass("email")}`}
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder='E-posta Adresiniz*' required />
                                    <div className='invalid-feedback'>Geçerli bir e-posta adresi giriniz.</div>
                                </div>

                                <button type='submit' className='btn btn-success'>Ekle</button>
                            </form>
                        </div>
                    </div>) : ''
                }

            </div>
        </div>
    )
}

export default Status