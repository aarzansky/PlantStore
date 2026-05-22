import React, { useState } from "react";
import "./SignUpPage.css";
import Navbar from "../components/Navbar";

function SignUpPage({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
    <Navbar/>
    <div className="signup-page">
      <div className="signup-left">
        <h2 className="signup-logo" onClick={() => setPage("home")}>
           TheSecretGarden
        </h2>

        <h1 className="signup-title">Join Us</h1>

        <p className="signup-subtitle">
          Join our plant-loving community today
        </p>

        <input
          className="signup-input"
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

         <input
          className="signup-input"
          type="text"
          placeholder="Last Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="signup-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="signup-input"
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="signup-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <div>
            <input  
            className="signup-input"
            type="text"
            placeholder="Country"
            />
            <input  
            className="signup-input"
            type="text"
            placeholder="City"
            />
            <input  
            className="signup-input"
            type="text"
            placeholder="Address"
            />
           
        </div>
        <div className="gender-selection">
            <label htmlFor="Gender">Gender: </label>
            <input type="radio" name="Gender" id="male" /> Male
        <input type="radio" name="Gender" id="female" /> Female
        <input type="radio" name="Gender" id="other" /> Other
        </div>

        <button className="signup-btn">
          Create Account →
        </button>

        <p className="signup-footer">
          Already have an account?{" "}
          <span className="link" onClick={() => setPage("signin")}>
            Sign In
          </span>
        </p>
      </div>

      <div className="signup-right">
        <img
          src="./assets/tropical-green-leaves-background_53876-88891.avif"
          alt="Plants"
          className="signup-image"
        />
      </div>
    </div>
    </>
  );
}

export default SignUpPage;