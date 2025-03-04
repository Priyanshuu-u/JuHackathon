import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Make sure this is imported
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import image from "../../assets/Mednova.png";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch("https://ju-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userToken", result.token);
        toast.success(`Welcome ${result.user.name}`, { position: "top-right" });
        navigate("/home");
      } else {
        toast.error("Invalid response from server.");
      }
    } else {
      toast.error(result.message || "Invalid email or password!");
    }
  } catch (error) {
    console.error("Error during login:", error);
    toast.error("Failed to login. Please try again later.");
  }
};
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/004/449/782/non_2x/abstract-geometric-medical-cross-shape-medicine-and-science-concept-background-medicine-medical-health-cross-healthcare-decoration-for-flyers-poster-web-banner-and-card-illustration-vector.jpg')`,
      }}
    >
      <div className="w-full flex lg:flex-row flex-col-reverse items-center justify-between max-w-screen-xl px-4">
        {/* Left section with circular image */}
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center">
          <div className="h-64 w-64 rounded-full overflow-hidden shadow-lg">
            <img
              src={image}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Right section with login form */}
        <div className="lg:w-1/2 w-full bg-white bg-opacity-60 p-12 rounded-xl shadow-lg backdrop-blur-md h-full flex flex-col justify-between">
          <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
            Login
          </h2>
          <form className="space-y-4 flex-grow" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-blue-500 w-full mt-6">
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
