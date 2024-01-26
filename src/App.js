import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from "react-i18next"
import { BrowserRouter, Routes, Route } from "react-router-dom";


//Custom routes
import Home from "./routes/Home.tsx";
import StudyProgrammeManager from "./routes/StudyProgrammeManager.tsx";
import SubjectManager from './routes/SubjectManager.tsx';

//Custom Components
import MainNavbar from './components/VisualComponent/MainNavbar.component.tsx';
import AdminNavBar from './components/VisualComponent/AdminNavBar.component.tsx';

import "bootstrap/dist/css/bootstrap.css";
import IsAuthorized from "./components/IsAuthorized.tsx";
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
            </Routes>
            <IsAuthorized>
                <Routes>
                    <Route path="/manage/studyProgramme" element={<StudyProgrammeManager />} />
                    <Route path="/manage/subject" element={<SubjectManager />} />
                </Routes>
            </IsAuthorized>
        </div>
    );
}

export default App;
