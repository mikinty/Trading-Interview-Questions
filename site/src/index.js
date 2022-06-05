import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { HashRouter, Routes, Route } from "react-router-dom";
import CardSum from "./games/CardSum";
import Craps from "./games/Craps";
import FindMarket from "./games/FindMarket";
import "./styles/main.scss";

let rootElement = document.getElementById("root");
ReactDOM.render(
  <HashRouter
    basename={
      process.env.NODE_ENV === "production"
        ? "/Trading-Interview-Questions"
        : ""
    }
  >
    <Routes>
      <Route exact path="/cardsum" element={<CardSum />} />
      <Route exact path="/craps" element={<Craps />} />
      <Route exact path="/findmarket" element={<FindMarket />} />
      <Route path="/" element={<App />} />
    </Routes>
  </HashRouter>,
  rootElement
);
