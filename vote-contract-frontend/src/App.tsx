import { useEffect, useState } from "react";
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import "./App.css";
import detectProvider from "@portkey/detect-provider";
import { Button } from "./components/ui/button";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import CreateProposal from "./CreateProposal";
import HomeDAO from "./HomeDAO";

function App() {
  return (
    <>
      <>
        <Routes>
          <Route path="/" element={<HomeDAO />}></Route>
          <Route path="/create-proposal" element={<CreateProposal />}></Route>
        </Routes>
      </>
    </>
  );
}

export default App;
