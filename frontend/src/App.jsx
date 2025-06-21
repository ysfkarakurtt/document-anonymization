import {Route, Routes,  } from 'react-router-dom'
import './App.css'
import Homepage from './components/Homepage'
import Editor from './components/Editor'
import Referee from './components/Referee'
import NotFound from './components/NotFound'
import ArticleDetails from './components/ArticleDetails'
import Header from './components/Header'
import RefereeAdd from './components/RefereeAdd'
import Status from './components/Status'
import ArticleOperation from './components/ArticleOperation'
import Log from './components/Log'

function App() {


  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/articles/pdf/:trackingId' element={<ArticleDetails />} />
        <Route path='/article-operation/:id' element={<ArticleOperation />} />

        <Route path='/referee' element={<Referee />} />
        <Route path='/referee-add' element={<RefereeAdd />} />
        <Route path='/status' element={<Status />} />
        <Route path='/logs' element={<Log />} />

        <Route path='/notFoundPage' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
