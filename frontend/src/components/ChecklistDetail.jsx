// src/components/ChecklistDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const ChecklistDetail = () => {
  const { checklistId } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklistDetails();
  }, []);

  const fetchChecklistDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/checklists/${checklistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChecklist(data);
      } else {
        toast.error('Failed to fetch checklist details.');
      }
    } catch (error) {
      console.error('Error fetching checklist details:', error);
      toast.error('An error occurred while fetching the checklist details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          checklist && (
            <div className="card bg-base-100 shadow-xl p-6">
              <h1 className="text-4xl font-bold mb-4">Checklist for {checklist.patientDetails.name}</h1>
              <p className="mb-2"><strong>Created By:</strong> {checklist.createdBy.name}</p>
              <p className="mb-2"><strong>Status:</strong> {checklist.status}</p>
              <p className="mb-2"><strong>Team Members:</strong> {checklist.team.map((member) => member.name).join(', ')}</p>

              <h2 className="text-2xl font-semibold mt-6 mb-4">Induction</h2>
              <p className="mb-2"><strong>Patient Identity Confirmed:</strong> {checklist.sections.induction.patientIdentityConfirmed ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Site Marked:</strong> {checklist.sections.induction.siteMarked ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Anaesthesia Check Complete:</strong> {checklist.sections.induction.anaesthesiaCheckComplete ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Pulse Oximeter:</strong> {checklist.sections.induction.pulseOximeter ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Known Allergy:</strong> {checklist.sections.induction.knownAllergy}</p>
              <p className="mb-2"><strong>Difficult Airway Risk:</strong> {checklist.sections.induction.difficultAirwayRisk}</p>
              <p className="mb-2"><strong>Risk of Blood Loss:</strong> {checklist.sections.induction.riskOfBloodLoss}</p>

              <h2 className="text-2xl font-semibold mt-6 mb-4">Skin Incision</h2>
              <p className="mb-2"><strong>Team Introduced:</strong> {checklist.sections.skinIncision.teamIntroduced}</p>
              <p className="mb-2"><strong>Procedure Confirmed:</strong> {checklist.sections.skinIncision.procedureConfirmed ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Antibiotic Prophylaxis Given:</strong> {checklist.sections.skinIncision.antibioticProphylaxisGiven ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Sterility Confirmed:</strong> {checklist.sections.skinIncision.sterilityConfirmed ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Imaging Displayed:</strong> {checklist.sections.skinIncision.imagingDisplayed ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Critical Events (Surgeon):</strong> {checklist.sections.skinIncision.criticalEvents.surgeon}</p>
              <p className="mb-2"><strong>Critical Events (Anaesthetist):</strong> {checklist.sections.skinIncision.criticalEvents.anaesthetist}</p>
              <p className="mb-2"><strong>Critical Events (Nursing Team):</strong> {checklist.sections.skinIncision.criticalEvents.nursingTeam}</p>

              <h2 className="text-2xl font-semibold mt-6 mb-4">Post-Op</h2>
              <p className="mb-2"><strong>Instrument Count Confirmed:</strong> {checklist.sections.postOp.instrumentCountConfirmed ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Specimen Label Confirmed:</strong> {checklist.sections.postOp.specimenLabelConfirmed ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Equipment Problems:</strong> {checklist.sections.postOp.equipmentProblems ? 'Yes' : 'No'}</p>
              <p className="mb-2"><strong>Recovery Concerns:</strong> {checklist.sections.postOp.recoveryConcerns}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChecklistDetail;