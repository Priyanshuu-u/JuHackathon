// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const Dashboard = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
      setUserId(decodedToken.id);
      fetchChecklists(decodedToken.id);
    }
  }, []);

  const fetchChecklists = async (userId) => {
    try {
      const response = await fetch(`https://ju-backend.onrender.com/api/checklists/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChecklists(data);
      } else {
        toast.error('Failed to fetch checklists.');
      }
    } catch (error) {
      console.error('Error fetching checklists:', error);
      toast.error('An error occurred while fetching the checklists.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (checklistId) => {
    navigate(`/checklist/${checklistId}`);
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Total Checklists: {checklists.length}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {checklists.map((checklist) => (
                <div
                  key={checklist._id}
                  className="card bg-base-100 shadow-xl p-4 cursor-pointer hover:shadow-2xl"
                  onClick={() => handleCardClick(checklist._id)}
                >
                  <h3 className="text-xl font-bold mb-2">Checklist for {checklist.patientDetails.name}</h3>
                  <p className="mb-2">Created By: {checklist.createdBy.name}</p>
                  <p className="mb-2">Status: {checklist.status}</p>
                  <p className="mb-2">Team Members: {checklist.team.map((member) => member.name).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
