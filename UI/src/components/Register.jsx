import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const path = "http://localhost:3000/api/v1/user/register";
    try {
      const res = await axios.post(`${path}`, formData);
      if (res.status === 201) {
        toast.success(res.data.message || "User registered successfully");
        setTimeout(() => {
          setFormData({
            fullName: "",
            email: "",
            password: "",
          });
        }, 2000);
        setTimeout(() => navigate("/Login"), 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "User already exists");
      } else {
        toast.error("Error registering user");
      }
    }
  };

  return (
    <>
      <div className="p-8 rounded-lg shadow-lg w-[600px] h-auto mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300"
            >
              Sign Up
            </button>
            <a href="Login" className="text-blue-500 hover:underline">
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
