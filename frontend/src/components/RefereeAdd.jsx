import React, { useState } from 'react'
import '../css/RefereeAdd.css'
import axios from 'axios'
function RefereeAdd() {

  const [nameSurname, setNameSurname] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const referee = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/users/create`, {
        name: nameSurname,
        email: email,
        role: "referee",
      });
      console.log(referee.data.user);
      const refereeId = referee.data.user._id;


      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/referees/create`, {
        userId: refereeId,
        article: "",
        comments: "",
        decision: ""
      });

      alert("Hakem başarıyla eklendi.");
      setNameSurname('');
      setEmail('');

    } catch (error) {
      console.error("Hata oluştu: " + error);
      alert("Bir hata oluştu.");
    }
  };


  return (
    <div className='container'>
      <div className='card'>
      <h2>Hakem Ekle</h2>
        <form onSubmit={handleSubmit}>

          <div className='inputs'>
            <div className="input">
              <div className="icon">
                <i className="fa-regular fa-id-card fa-sm"></i>
              </div>
              <input type="text" placeholder='Ad Soyad' value={nameSurname}
                onChange={e => setNameSurname(e.target.value)} required />
            </div>

            <div className="input">
              <div className='icon'>
                <i className="fa-solid fa-envelope fa-sm"></i>
              </div>
              <input type="email" placeholder='E-Posta' value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className='submit-container'>
            <button className='submit' >
              Hakemi Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RefereeAdd