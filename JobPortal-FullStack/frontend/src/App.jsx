import React, { useEffect } from "react";
import Lenis from "lenis";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import DashBoard from "./pages/DashBoard";
import PostApplication from "./pages/PostApplication";
import NotFound from "./pages/NotFound";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e) => {
      console.log(e);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  },[]);
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route
            path="/post/application/:jobId"
            element={<PostApplication />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
