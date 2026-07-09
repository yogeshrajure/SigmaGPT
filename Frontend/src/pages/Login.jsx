import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
const Login = () => {
  const navigate = useNavigate();
  const { user, loading, checkAuth } = useAuth();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // If already logged in, don't show login page
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
        "http://localhost:5000/auth/login",
        inputValue,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        // Update AuthContext by calling /auth/me
        await checkAuth();

        handleSuccess(data.message);

        setInputValue({
          email: "",
          password: "",
        });

        navigate("/chat");
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
      <h2>Login Account</h2>

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

        <button type="submit">Login</button>

        <span>Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "underline" }}>Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;