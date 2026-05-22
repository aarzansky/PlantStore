import React from "react";
import "./Navbar.css";

function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo"> TheSecretGarden</div>

      <div className="navbar-links">
        <a href="">Plants</a>
        <a href="">Care</a>
        <a href="#features">Features</a>
        <a href="#about">About us</a>
      </div>

      <div className="navbar-buttons">
        <button className="btn-outline" onClick={() => setPage("signin")}>
          Sign in
        </button>
        <button className="btn-primary" onClick={() => setPage("signup")}>
          Sign up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
