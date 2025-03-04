import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import Login from "./components/Login/Login"; // Your Login component
import Signup from "./components/Signup"; // Your Signup component
import Home from "./components/Home"; // Your Home component
import Base from "./components/Base"; // Your Home component
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import MediMitra from "./components/MediMitra";
import Aarogyam from "./components/Aarogyam";
import NewChecklist from "./components/NewChecklist";
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import ChecklistDetail from "./components/ChecklistDetail";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>   <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Base />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/medi-mitra" element={<MediMitra />} />
          <Route path="/aarogyam" element={<Aarogyam />} />
          <Route path="/new-checklist" element={<NewChecklist />} />
          <Route path="/checklist/:checklistId" element={<ChecklistDetail />} />
        </Routes>
        <ToastContainer /> {/* Place ToastContainer here to display toasts */}
      </div>
    </Router>
      </AuthProvider>
 
  );
}

export default App;
