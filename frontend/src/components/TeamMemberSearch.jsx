import React, { useState } from 'react';
import { toast } from 'react-toastify';

const TeamMemberSearch = ({ addTeamMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      toast.error('Please enter a search term.');
      return;
    }

    try {
      const response = await fetch(`https://ju-backend.onrender.com/api/checklists/users?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result)) {
          setSearchResults(result);
        } else {
          setSearchResults([]);
        }
      } else {
        console.error('Failed to fetch users:', response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleAddTeamMember = (user) => {
    addTeamMember(user);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="relative w-full">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for team members"
          className="input input-bordered w-full"
        />
        <button onClick={handleSearch} className="btn btn-blue-500">
          Search
        </button>
      </div>
      {searchResults.length > 0 && (
        <ul className="absolute bg-white border border-gray-200 w-full mt-2 rounded-lg shadow-lg z-10">
          {searchResults.map((user) => (
            <li key={user._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddTeamMember(user)}>
              {user.name} ({user.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamMemberSearch;
