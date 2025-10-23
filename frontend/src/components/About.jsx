import React from "react";
import Navbar from "./Navbar.jsx";
import ruchin from "../assets/Ruchin.jpeg"
function About() {
  const teamMembers = [
    {
      name: "Priyanshu Rajpurohit",
      college: "JECRC College(B.Tech CSE)",
      photo: "https://media.licdn.com/dms/image/v2/D5603AQEAM0MBl-MVPw/profile-displayphoto-scale_400_400/B56ZmgG2xXJ8Ag-/0/1759327777970?e=2147483647&v=beta&t=u_wvOGYv-utVa2LX1QbelInh5-lTE538xS4ir2e8h4s", // Replace with actual photo URL
    },
  ];

  return (
  <div>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 p-8">
      {/* About Section Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-cyan-700 mb-4">About US</h1>
        <p className="text-lg text-gray-600">
          This Project was developed during a hackathon focused on improving healthcare outcomes.  
          Our team of passionate developers came together to build this platform to promote safer 
          surgical practices worldwide using the WHO Checklist.
        </p>
      </div>
 
      {/* Team Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-cyan-700 mb-6">Meet Our Team</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="card shadow-lg bg-white p-6 rounded-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-40 h-40 rounded-full border-4 border-cyan-500 mb-4"
                />
                <h3 className="text-xl font-semibold text-cyan-700">{member.name}</h3>
                <p className="text-gray-600">{member.college}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Note */}
      <div className="text-center mt-12">
        <p className="text-gray-600 text-lg">
          We hope MediMitra can make a real difference in improving surgical safety. Let's work 
          together to save lives and make healthcare safer!
        </p>
      </div>
    </div>
    </div>
  );
}

export default About;
