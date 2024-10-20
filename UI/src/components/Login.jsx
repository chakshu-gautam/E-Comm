import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const [formData, setFormData] = useState({
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
    const path = "http://localhost:3000/api/v1/user/login";
    try {
      const res = await axios.post(`${path}`, formData);
      if (res.status) {
        toast.success(res.data.message || "Login successful");
        localStorage.setItem("token", res.data.token);
        setTimeout(() => {
          setFormData({
            email: "",
            password: "",
          });
        }, 2000);
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(
          error.response.data.message ||
            "User does not exists! Try registering user"
        );
      } else {
        toast.error("Error logging in");
      }
    }
  };

  return (
    <>
      <div className="p-8 rounded-lg shadow-lg w-[600px] h-auto mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              Login
            </button>
            <a href="Register" className="text-blue-500 hover:underline">
              Don't have an account? Register
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
