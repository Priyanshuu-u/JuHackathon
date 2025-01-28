import React from 'react';
import "../App.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Mednova.png";

function Base() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/004/449/782/non_2x/abstract-geometric-medical-cross-shape-medicine-and-science-concept-background-medicine-medical-health-cross-healthcare-decoration-for-flyers-poster-web-banner-and-card-illustration-vector.jpg')`,
      }}
    >
      <div className="card card-side bg-white shadow-lg rounded-2xl p-6 max-w-5xl">
        <figure className="w-1/2">
          <img
            src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/597aa93b-5c5c-412f-b38f-45a19338b780/97c5747d-76ec-433f-8fd8-afab38ba54b0.png"
            alt="WHO Checklist"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body w-1/2">
          {/* Logo Section */}
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="Mednova Logo"
              className="w-30 h-30 rounded-full mb-3"
            />
          </div>
          {/* Title Section */}
          <h2 className="card-title text-2xl font-bold text-gray-800">
            WHO Surgical Safety Checklist
          </h2>
          <p className="text-gray-600 mt-2">
            The WHO Surgical Safety Checklist is a global initiative designed to improve patient safety
            during surgical procedures. By following structured steps, healthcare providers can reduce
            errors, enhance communication, and ensure that the surgery is as safe as possible.
          </p>
          <p className="text-gray-600 mt-2">Key points of the checklist include:</p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Confirming patient identity and procedure details.</li>
            <li>Ensuring availability of necessary equipment and resources.</li>
            <li>Clear communication among surgical team members.</li>
            <li>Post-surgical safety checks to prevent complications.</li>
          </ul>
          <p className="text-gray-600 mt-2">
            Click below to get started with implementing the checklist or learning more about it.
          </p>
          <div className="card-actions mt-4">
            <Link to="/login">
              <button className="btn btn-primary w-full py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                Login/SignUp
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base;
