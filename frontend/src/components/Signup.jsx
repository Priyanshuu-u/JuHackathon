import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/Mednova.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("password", e.target.password.value);
    formData.append("role", e.target.role.value);
    formData.append("photo", selectedFile);

    try {
      const response = await fetch("https://ju-frontend.onrender.com/signup", {
        method: "POST",
        body: formData,
      });

     
      if (response.ok) {
         const result = await response.json();
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify(result.user)); // Store user data
        localStorage.setItem("userToken", result.token); // Store the token

        // Show success toast with the correct position
        toast.success(`Welcome ${result.user.name}`, {
          position: "top-right", // Use string position directly
        });

        navigate("/home"); // Redirect to Home
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/004/449/782/non_2x/abstract-geometric-medical-cross-shape-medicine-and-science-concept-background-medicine-medical-health-cross-healthcare-decoration-for-flyers-poster-web-banner-and-card-illustration-vector.jpg')`,
    }}>
      <div className="w-full flex lg:flex-row flex-col-reverse items-center justify-between max-w-screen-xl px-4">
        <div className="hidden lg:block w-full lg:w-1/2 h-full">
          <img
            src={image}
            alt="Background"
            className="object-cover w-full h-full rounded-l-xl"
          />
        </div>
        <div className="lg:w-1/2 w-full bg-white bg-opacity-60 p-12 rounded-xl shadow-lg backdrop-blur-md h-full flex flex-col justify-between">
          <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
            Sign Up
          </h2>
          <form className="space-y-4 flex-grow" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="input input-bordered w-full p-2 rounded-md"
                required
              />
            </div>
            <div className="form-control">
              <label className="label text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full p-2 rounded-md"
                required
              />
            </div>
            <div className="form-control">
              <label className="label text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full p-2 rounded-md"
                required
              />
            </div>
            <div className="form-control">
              <label className="label text-gray-700">Photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="input input-bordered w-full p-2 rounded-md"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label text-gray-700">Role</label>
              <select
                name="role"
                className="input input-bordered w-full p-2 rounded-md"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <button type="submit" className="btn btn-blue-500 w-full mt-6">
              Sign Up
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
