import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from "react-i18next"
import { BrowserRouter, Routes, Route } from "react-router-dom";


//Custom routes
import Home from "./routes/Home.tsx";
import StudyProgrammeDetail from './routes/StudyProgrammeDetail.tsx';
import SubjectDetail from './routes/SubjectDetail.tsx';
import StudyProgrammeManager from "./routes/Manager/StudyProgrammeManager.tsx";
import SubjectManager from './routes/Manager/SubjectManager.tsx';
import TopicManager from './routes/Manager/TopicManager.tsx';
import DigitalContentManager from './routes/Manager/DigitalContentManager.tsx';

//Custom Components
import MainNavbar from './components/VisualComponent/MainNavbar.component.tsx';
import AdminNavBar from './components/VisualComponent/AdminNavBar.component.tsx';

import "bootstrap/dist/css/bootstrap.css";
import './App.css';



function App() {
    const { i18n } = useTranslation();
    i18n.changeLanguage("en")
    return (
        <div className="App  min-h-[100%]">
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
            <MainNavbar />
            <AdminNavBar />
            <Routes>
                <Route index path='/' element={<Home></Home>}></Route>
                <Route index path='/studyProgramme/:id' element={<StudyProgrammeDetail></StudyProgrammeDetail>}></Route>
                <Route index path='/subject/:id' element={<SubjectDetail></SubjectDetail>}></Route>
            </Routes>

            <Routes>
                <Route path="/manage/studyProgramme" element={<StudyProgrammeManager />} />
                <Route path="/manage/subject" element={<SubjectManager />} />
                <Route path="/manage/topic" element={<TopicManager />} />
                <Route path="/manage/digitalContent" element={<DigitalContentManager />} />
            </Routes>

        </div>
    );
}

export default App;
