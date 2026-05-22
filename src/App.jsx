import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      {page === "home" ? (
        <LandingPage setPage={setPage} />
      ) : (
        <SignInPage setPage={setPage} />
      )}
    </div>
  );
}

export default App;