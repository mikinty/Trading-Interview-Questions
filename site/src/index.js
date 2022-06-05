import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardSum from "./games/CardSum";
import Craps from "./games/Craps";
import "./styles/main.scss";

let rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="cardsum" element={<CardSum />} />
      <Route path="craps" element={<Craps />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
