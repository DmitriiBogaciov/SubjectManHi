import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./routes/home";
import Subject from "./routes/subject-detail";
import reportWebVitals from "./reportWebVitals";
import Auth0ProviderWithNavigate from "./auth0-provider-with-navigate";
import Program from "./routes/Program";
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/subject/:id" element={<Subject />} />
          <Route path="/program/:id" element={<Program />} />
        </Route>
      </Routes>

    </Auth0ProviderWithNavigate>
  </BrowserRouter>

);
reportWebVitals();
