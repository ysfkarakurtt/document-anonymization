import React, { useState } from 'react';
import axios from 'axios';
import '../css/Referee.css';
import { useNavigate } from 'react-router-dom';

function Referee() {
  const navigate = useNavigate();
  const [nameSurname, setNameSurname] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [refereeComments, setRefereeComments] = useState('');
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const openAnonymizedArticleInNewTab = () => {
    if (articleId) {
      window.open(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/anonymized/pdf/${articleId}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleSubmitSave = (event) => {
    event.preventDefault();
    if (!selectedStatus) {
      alert("Lütfen geçerli bir makale durumu seçiniz!");
      return;
    }
    try {

      const formData = new FormData();

      formData.append('comments', refereeComments);

      axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/${reviewerId}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(async (res) => {
          console.log("Hakem Yorumu başarıyla güncellendi:", res.data);
          try {
            const log = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/logs/create`, {
              message: "Hakem, makaleyle alakalı güncelleme yaptı.",
              trackingId: articleId,
            });
            console.log(log.data);
          } catch (error) {
            console.log(error);
          }

          try {
            const log = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/articles/article/update`, {
              status: selectedStatus,
            });
            console.log(log.data);
          } catch (error) {
            console.log(error);
          }
          alert("Hakem Yorumu ve makale durumu güncellendi!");
          navigate(0);
        })
        .catch((err) => {
          console.error("Hakem yorumu güncelleme hatası:", err);

        });



    } catch (error) {
      console.error("Hata oluştu: " + error);
      alert("Bir hata oluştu.");
    }


  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/users/referee-by-name`, {
        params: { name: nameSurname }
      });

      if (response.data.length > 0) {
        const referee = response.data[0];
        const refereeId = referee._id;
        setReviewerId(refereeId);

        const refereeResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/referee-by-id`, {
          params: { userId: refereeId }
        });

        if (refereeResponse.data.length > 0) {
          setRefereeComments(refereeResponse.data[0].comments);
          setArticleId(refereeResponse.data[0].articleId);
          console.log(JSON.stringify(refereeResponse.data[0].articleId));

        } else {
          setErrorMessage('Hakemin ilgili makalesi bulunamadı.');
        }
      } else {
        setErrorMessage('Hakem bulunamadı.');
      }
    } catch (error) {
      console.error('Error fetching referee:', error);
      setErrorMessage('Bir hata oluştu.');
    }
  };

  return (
    <div className='container'>
      <div className='card'>
        <h2>Değerlendirilecek Makaleyi Sorgulama</h2>
        <form onSubmit={handleSubmit}>

          <div className='inputs'>
            <div className="input">
              <div className="icon">
                <i className="fa-regular fa-id-card fa-sm"></i>
              </div>
              <input
                type="text"
                placeholder='Hakem adınızı giriniz'
                value={nameSurname}
                onChange={e => setNameSurname(e.target.value)}
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {articleId &&
          <div className="anonymized-article-detail">
            <h4>Atanan Makale</h4>
            <div className="row">
              Makale ID: {articleId}
              <button className='btn btn-primary' onClick={openAnonymizedArticleInNewTab}>Makele incele</button>
            </div>
            <h4 >Hakem Yorumu </h4>
            <div className="row">
              <div className="form-group">

                <textarea className="form-control" id="exampleFormControlTextarea1"
                  placeholder='Hakem yorumunu giriniz'
                  value={refereeComments} onChange={e => setRefereeComments(e.target.value)}
                  rows="3"></textarea>
              </div>

            </div>

            <select class="custom-select" value={selectedStatus} onChange={handleChange} >
              <option selected value="">Makale durumunu seç</option>
              <option value="waiting">Waiting</option>
              <option value="accept">Accept</option>
              <option value="revise">Revise</option>
              <option value="reject">Reject</option>
            </select>
            <button className='btn btn-success' onClick={handleSubmitSave}> Kaydet</button>
          </div>}

      </div>
    </div>
  );
}

export default Referee;
