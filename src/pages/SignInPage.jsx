import React, { useState } from "react";
import "./SignInPage.css";
import Navbar from "../components/Navbar";

function SignInPage({ setPage }) {
  const [tab, setTab] = useState("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");


  return (
    <>
          <Navbar setPage={setPage} />
    <div className="signin-page">
      <div className="signin-left">
        <h2 className="signin-logo" onClick={() => setPage("home")}>
         TheSecretGarden
        </h2>

        <p className="signin-subtitle">Log in with your Email</p>

        <div className="signin-tabs">
          <button
            className={tab === "email" ? "tab active-tab" : "tab"}
            onClick={() => setTab("email")}
          >
            Email
          </button>
        </div>

        {tab === "email" && (
          <input
            className="signin-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        )}


        <input
          className="signin-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signin-btn">
          Continue →
        </button>

        <p className="signin-footer">
          Don't have an account?{" "}
          <span className="link" onClick={() => setPage("signup")}>
            Sign Up
          </span>
        </p>
      </div>

      <div className="signin-right">
        <img
          src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800"
          alt="Plant decoration"
          className="signin-image"
        />
      </div>
    </div>
    </>
  );
}

export default SignInPage;
