import React, { useState } from 'react';
import '../css/Homepage.css';
import { MdEmail, MdOutlineArticle } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import axios from 'axios';
import { FaStickerMule } from 'react-icons/fa';

function Homepage() {
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [articleName, setArticleName] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [filePreview, setFilePreview] = useState(null);
    const [flag, setFlag] = useState(FaStickerMule);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [addedArticle, setAddedArticle] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFilePreview(uploadedFile ? uploadedFile.name : null);
    };

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const newErrors = {
            email: !email || !emailRegex.test(email),
            author: !author.trim(),
            articleName: !articleName.trim()
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const getValidationClass = (field) => {
        if (!submitted) return "";
        return errors[field] ? "is-invalid" : "is-valid";
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
            console.log(trackingId);
            setFlag(true);

            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/users/create`, {
                name: author, email, role: "author"
            });

            try {
                const log = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/logs/create`, {
                    message: "Editöre Makale geldi.",
                    trackingId: uploadRes.data.trackingId,
                });
                console.log(log.data);
            } catch (error) {
                console.log(error);
            }
            setAddedArticle(true);
            setTimeout(() => setAddedArticle(false), 3000);

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
            <div className='upload-form'>
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
                            <input type='text' className={`form-control ${getValidationClass("author")}`}
                                value={author} onChange={(e) => setAuthor(e.target.value)}
                                placeholder='Yazar Adı, Soyadı*' required />
                            <div className='invalid-feedback'>Bu alan boş bırakılamaz.</div>
                        </div>

                        <div className='form-group mb-4 flex-row'>
                            <div className='add-article-form-icon'><MdOutlineArticle /></div>
                            <input type='text' className={`form-control ${getValidationClass("articleName")}`}
                                value={articleName} onChange={(e) => setArticleName(e.target.value)}
                                placeholder='Makale Adı*' required />
                            <div className='invalid-feedback'>Bu alan boş bırakılamaz.</div>
                        </div>

                        <div className='form-group mb-3 flex-row'>
                            <div className='add-article-form-icon'><MdEmail /></div>
                            <input type='email' className={`form-control ${getValidationClass("email")}`}
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder='E-posta Adresiniz*' required />
                            <div className='invalid-feedback'>Geçerli bir e-posta adresi giriniz.</div>
                        </div>

                        <button type='submit' className='btn btn-success'>Ekle</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Homepage;