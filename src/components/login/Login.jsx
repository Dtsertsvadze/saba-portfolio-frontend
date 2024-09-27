import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const baseUrl = "https://sabagorgodze.com";

  const navigate = useNavigate();

  const fetchToken = async (username, password) => {
    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Failed to login");
      const data = await response.json();
      navigate("/admin");
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchToken(credentials.username, credentials.password);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="form-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          onChange={handleChange}
          value={credentials.username}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={handleChange}
          value={credentials.password}
        />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
