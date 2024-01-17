import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from './components/visual-component/navbar-main';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";

import { ToastContainer } from 'react-bootstrap';

function App() {

  return (
      <div className="App bg-slate-900 min-h-[100%]">
          <Helmet>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Helmet>
          <Navigation/>
          <Outlet />

      </div>
  );
}

export default App;
