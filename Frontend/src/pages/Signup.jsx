import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";
const Signup = () => {
  const navigate = useNavigate();
  const { user, loading ,checkAuth } = useAuth();

  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { email, username, password } = inputValue;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // If already logged in, don't show signup page
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleError = (msg) => {
    toast.error(msg, {
      position: "bottom-left",
    });
  };

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "bottom-left",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        inputValue,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        handleSuccess(data.message);

        await checkAuth();

        setTimeout(() => {
          navigate("/chat");
        }, 300);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      handleError(message);
    }
  };

  return (
    <div className="form_container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            required
          />
        </div>

        <button className="auth-btn" type="submit">Signup</button>

        <span className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;