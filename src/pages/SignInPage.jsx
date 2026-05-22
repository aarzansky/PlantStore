import React, { useState } from "react";
import "./SignInPage.css";

function SignInPage({ setPage }) {
  const [tab, setTab] = useState("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div className="signin-page">
      <div className="signin-left">
        <h2 className="signin-logo" onClick={() => setPage("home")}>
          🌿 TheSecretGarden
        </h2>

        <h1 className="signin-title">Sign in</h1>
        <p className="signin-subtitle">Log in with your Email or your Phone Number</p>

        <div className="signin-tabs">
          <button
            className={tab === "email" ? "tab active-tab" : "tab"}
            onClick={() => setTab("email")}
          >
            Email
          </button>
          <button
            className={tab === "phone" ? "tab active-tab" : "tab"}
            onClick={() => setTab("phone")}
          >
            Phone Number
          </button>
        </div>

        {tab === "email" && (
          <input
            className="signin-input"
            type="email"
            placeholder="example.email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        )}

        {tab === "phone" && (
          <input
            className="signin-input"
            type="tel"
            placeholder="+977 98XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          <span className="link" onClick={() => alert("Sign Up page coming soon!")}>
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
  );
}

export default SignInPage;
