import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Article from "./Article";
import axios from "axios";
import "../css/ArticleOperation.css";

function ArticleOperation() {
    const navigate = useNavigate();
    const { id: trackingId } = useParams();
    const [article, setArticle] = useState(null);
    const [articleId, setArticleId] = useState('');
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [referees, setReferees] = useState([]);
    const [referee, setReferee] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articleRes, refereesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/article/${trackingId}`),
                    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/`)
                ]);

                setArticle(articleRes.data.article);
                setArticleId(articleRes.data.article.trackingId);
                setReferees(refereesRes.data);
            } catch (err) {
                console.error("Veri getirme hatası:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [trackingId]);

    useEffect(() => {
        if (!articleId) return;
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/referee-by-articleId`, { params: { articleId } })
            .then(res => setReferee(res.data))
            .catch(err => console.error("Atanan Hakemi getirme hatası:", err));
    }, [articleId]);

    useEffect(() => {
        referees.forEach(referee => {
            if (referee.reviewer && !userInfo[referee.reviewer]) {
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/users/referee/${referee.reviewer}`)
                    .then(res => setUserInfo(prevState => ({ ...prevState, [referee.reviewer]: res.data })))
                    .catch(err => console.error("Kullanıcı getirme hatası:", err));
            }
        });
    }, [referees]);

    if (loading) return <p className="text-center">Yükleniyor...</p>;
    if (!article) return <p>Makale bulunamadı.</p>;

    const handleSubmit = async (reviewerId) => {
        if (!article?.anonymizedPdf) {
            alert("Lütfen hakem atamadan önce makaleyi anonimleştiriniz!");
            return;
        }
        try {
            await axios.put(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/${reviewerId}/update`,
                { articleId: article.trackingId }
            );
            try {
                const log = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/logs/create`, {
                    message: "Makale, hakeme atandı.",
                    trackingId: trackingId,
                });
                console.log(log.data);
            } catch (error) {
                console.log(error);
            }
            alert("Hakem makaleye atandı!");
            navigate(0);
        } catch (err) {
            console.error("Hakemi güncelleme hatası:", err);
            alert("Bir hata oluştu, lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="container">
            <div className="article-detail">
                <Article key={trackingId} article={article} />
            </div>
            <div className="operations">
                <h2>Atanabilecek Hakemler</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Adı Soyadı</th>
                            <th>E-Posta</th>
                            <th>Müsaitlik Durumu</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {referees.map((referee, index) => {
                            const user = userInfo[referee.reviewer];
                            console.log(user)
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user ? user.name : "Yükleniyor..."}</td>
                                    <td>{user ? user.email : "Yükleniyor..."}</td>
                                    <td>{referee.articleId ? "Dolu" : "Boş"}</td>
                                    <td>
                                        {!referee.articleId && (
                                            <button
                                                onClick={() => handleSubmit(referee.reviewer)}
                                                className="btn btn-primary"
                                            >
                                                Ata
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <h2>Hakem Yorumu</h2>
            <div className="review-comment">
                <span>{referee?.comments || "Henüz hakem yorum yapmadı."}</span>
            </div>
        </div>
    );
}

export default ArticleOperation;
