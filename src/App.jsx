import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      {page === "home" ? (
        <LandingPage setPage={setPage} />
      ) : page === "signin" ? (
        <SignInPage setPage={setPage} />
      ):(
        <SignUpPage setPage={setPage}/>
      )}
    </div>
  );
}

export default App;