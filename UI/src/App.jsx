import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/Home";
function App() {
  return (
    <div className="bg-black-100 min-h-screen flex items-center justify-center">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
