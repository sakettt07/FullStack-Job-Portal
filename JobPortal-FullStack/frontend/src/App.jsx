import React from 'react';
import "./App.css";
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route />
        <Route />
        <Route />
        <Route />
        <Route />
        <Route />
      </Routes>
    </Router>
    </>
  )
}

export default App
