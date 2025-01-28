import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar.jsx';
import TeamMemberSearch from './TeamMemberSearch.jsx';

const NewChecklist = () => {
  const [userId, setUserId] = useState('');
  const [checklist, setChecklist] = useState({
    patientDetails: {
      name: '',
      age: '',
      medicalHistory: '',
    },
    team: [],
    sections: {
      induction: {
        patientIdentityConfirmed: false,
        siteMarked: false,
        anaesthesiaCheckComplete: false,
        pulseOximeter: false,
        knownAllergy: '',
        difficultAirwayRisk: '',
        riskOfBloodLoss: '',
      },
      skinIncision: {
        teamIntroduced: '',
        procedureConfirmed: false,
        antibioticProphylaxisGiven: false,
        criticalEvents: {
          surgeon: '',
          anaesthetist: '',
          nursingTeam: '',
        },
        sterilityConfirmed: false,
        imagingDisplayed: false,
      },
      postOp: {
        instrumentCountConfirmed: false,
        specimenLabelConfirmed: false,
        recoveryConcerns: '',
        equipmentProblems: false,
      },
    },
    createdBy: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
      setUserId(decodedToken.id);
    }
  }, []);

  const addTeamMember = (user) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      team: [...prevChecklist.team, user],
    }));
  };

  const removeTeamMember = (index) => {
    setChecklist((prevChecklist) => {
      const newTeam = [...prevChecklist.team];
      newTeam.splice(index, 1);
      return {
        ...prevChecklist,
        team: newTeam,
      };
    });
  };

  const handleCheckboxChange = (section, field) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      sections: {
        ...prevChecklist.sections,
        [section]: {
          ...prevChecklist.sections[section],
          [field]: !prevChecklist.sections[section][field],
        },
      },
    }));
  };

  const handleInputChange = (section, field, value) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      sections: {
        ...prevChecklist.sections,
        [section]: {
          ...prevChecklist.sections[section],
          [field]: value,
        },
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!checklist.patientDetails.name) newErrors.name = 'Name is required';
    if (!checklist.patientDetails.age) newErrors.age = 'Age is required';
    if (!checklist.patientDetails.medicalHistory) newErrors.medicalHistory = 'Medical history is required';

    if (checklist.team.length === 0) newErrors.team = 'At least one team member is required';

    if (!checklist.sections.induction.knownAllergy) newErrors.knownAllergy = 'Known allergy is required';
    if (!checklist.sections.induction.difficultAirwayRisk) newErrors.difficultAirwayRisk = 'Difficult airway risk is required';
    if (!checklist.sections.induction.riskOfBloodLoss) newErrors.riskOfBloodLoss = 'Risk of blood loss is required';

    if (!checklist.sections.skinIncision.teamIntroduced) newErrors.teamIntroduced = 'Team introduced is required';
    if (!checklist.sections.skinIncision.criticalEvents.surgeon) newErrors.surgeon = 'Critical events (surgeon) are required';

    if (!checklist.sections.postOp.recoveryConcerns) newErrors.recoveryConcerns = 'Recovery concerns are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields.');
      return;
    }

    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      createdBy: userId,
    }));

    console.log('Submitting Checklist:', checklist);

    try {
      const response = await fetch('http://localhost:5000/api/checklists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify({
          ...checklist,
          createdBy: userId,
          team: checklist.team.map(member => member._id), // Send only the IDs to the server
        }),
      });

      if (response.ok) {
        const newChecklist = await response.json();
        console.log('Checklist created:', newChecklist);
        toast.success('Checklist submitted successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000); // Redirect to dashboard after 3 seconds
      } else {
        console.error('Failed to create checklist');
        toast.error('Failed to submit checklist.');
      }
    } catch (error) {
      console.error('Error creating checklist:', error);
      toast.error('An error occurred while submitting the checklist.');
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="h-screen overflow-y-auto">
        
        {/* Patient Details Section */}
        <section className="min-h-screen flex flex-col justify-center items-center p-4 space-y-4 bg-base-200">
          <h1 className="text-4xl font-bold">Patient Details</h1>
          <div className="w-full max-w-2xl">
            <div className="card bg-base-100 shadow-xl p-6">
              <div className="form-control space-y-4">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Name"
                  value={checklist.patientDetails.name}
                  onChange={(e) =>
                    setChecklist((prev) => ({
                      ...prev,
                      patientDetails: {
                        ...prev.patientDetails,
                        name: e.target.value,
                      },
                    }))
                  }
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Age"
                  value={checklist.patientDetails.age}
                  onChange={(e) =>
                    setChecklist((prev) => ({
                      ...prev,
                      patientDetails: {
                        ...prev.patientDetails,
                        age: e.target.value,
                      },
                    }))
                  }
                />
                {errors.age && <p className="text-red-500">{errors.age}</p>}
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Medical History"
                  value={checklist.patientDetails.medicalHistory}
                  onChange={(e) =>
                    setChecklist((prev) => ({
                      ...prev,
                      patientDetails: {
                        ...prev.patientDetails,
                        medicalHistory: e.target.value,
                      },
                    }))
                  }
                ></textarea>
                {errors.medicalHistory && <p className="text-red-500">{errors.medicalHistory}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="min-h-screen flex flex-col justify-center items-center p-4 space-y-4 bg-base-200">
          <h2 className="text-4xl font-bold">Add Team Members</h2>
          <div className="w-full max-w-2xl">
            <div className="card bg-base-100 shadow-xl p-6">
              <TeamMemberSearch addTeamMember={addTeamMember} />
              {errors.team && <p className="text-red-500">{errors.team}</p>}
              <ul className="mt-4">
                {checklist.team.map((member, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
                    <span>{member.name} ({member.role})</span>
                    <button className="btn btn-outline btn-sm" onClick={() => removeTeamMember(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Checklist Section */}
        <section className="min-h-screen flex flex-col justify-center items-center p-4 space-y-4 bg-base-200">
          <h2 className="text-4xl font-bold mb-4">Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {/* Induction Section */}
            <div className="card bg-base-100 shadow-xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold">Induction</h3>
              {['patientIdentityConfirmed', 'siteMarked', 'anaesthesiaCheckComplete', 'pulseOximeter'].map((field) => (
                <div className="flex items-center space-x-2" key={field}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={checklist.sections.induction[field]}
                    onChange={() => handleCheckboxChange('induction', field)}
                  />
                  <label>{field.split(/(?=[A-Z])/).join(' ')}</label>
                </div>
              ))}
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Known Allergy"
                value={checklist.sections.induction.knownAllergy}
                onChange={(e) => handleInputChange('induction', 'knownAllergy', e.target.value)}
              />
              {errors.knownAllergy && <p className="text-red-500">{errors.knownAllergy}</p>}
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Difficult Airway Risk"
                value={checklist.sections.induction.difficultAirwayRisk}
                onChange={(e) => handleInputChange('induction', 'difficultAirwayRisk', e.target.value)}
              />
              {errors.difficultAirwayRisk && <p className="text-red-500">{errors.difficultAirwayRisk}</p>}
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Risk of Blood Loss"
                value={checklist.sections.induction.riskOfBloodLoss}
                onChange={(e) => handleInputChange('induction', 'riskOfBloodLoss', e.target.value)}
              />
              {errors.riskOfBloodLoss && <p className="text-red-500">{errors.riskOfBloodLoss}</p>}
            </div>

            {/* Skin Incision Section */}
            <div className="card bg-base-100 shadow-xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold">Skin Incision</h3>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Team Introduced"
                value={checklist.sections.skinIncision.teamIntroduced}
                onChange={(e) => handleInputChange('skinIncision', 'teamIntroduced', e.target.value)}
              />
              {errors.teamIntroduced && <p className="text-red-500">{errors.teamIntroduced}</p>}
              {['procedureConfirmed', 'antibioticProphylaxisGiven', 'sterilityConfirmed', 'imagingDisplayed'].map((field) => (
                <div className="flex items-center space-x-2" key={field}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={checklist.sections.skinIncision[field]}
                    onChange={() => handleCheckboxChange('skinIncision', field)}
                  />
                  <label>{field.split(/(?=[A-Z])/).join(' ')}</label>
                </div>
              ))}
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Critical Events (Surgeon)"
                value={checklist.sections.skinIncision.criticalEvents.surgeon}
                onChange={(e) =>
                  setChecklist((prevChecklist) => ({
                    ...prevChecklist,
                    sections: {
                      ...prevChecklist.sections,
                      skinIncision: {
                        ...prevChecklist.sections.skinIncision,
                        criticalEvents: {
                          ...prevChecklist.sections.skinIncision.criticalEvents,
                          surgeon: e.target.value,
                        },
                      },
                    },
                  }))
                }
              ></textarea>
              {errors.surgeon && <p className="text-red-500">{errors.surgeon}</p>}
            </div>

            {/* Post-Op Section */}
            <div className="card bg-base-100 shadow-xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold">Post-Op</h3>
              {['instrumentCountConfirmed', 'specimenLabelConfirmed', 'equipmentProblems'].map((field) => (
                <div className="flex items-center space-x-2" key={field}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={checklist.sections.postOp[field]}
                    onChange={() => handleCheckboxChange('postOp', field)}
                  />
                  <label>{field.split(/(?=[A-Z])/).join(' ')}</label>
                </div>
              ))}
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Recovery Concerns"
                value={checklist.sections.postOp.recoveryConcerns}
                onChange={(e) => handleInputChange('postOp', 'recoveryConcerns', e.target.value)}
              ></textarea>
              {errors.recoveryConcerns && <p className="text-red-500">{errors.recoveryConcerns}</p>}
            </div>
          </div>
        </section>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-8 p-4">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default NewChecklist;