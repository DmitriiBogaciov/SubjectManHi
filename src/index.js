import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";


import reportWebVitals from "./reportWebVitals";
import Auth0ProviderWithNavigate from "./auth0-provider-with-navigate";

import 'react-toastify/dist/ReactToastify.css';
import "./i18n.tsx";

const root = createRoot(document.getElementById("root"));
root.render(

    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App></App>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>

);
reportWebVitals();
