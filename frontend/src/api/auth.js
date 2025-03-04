const API_URL = "https://ju-backend.onrender.com/api/auth";

// http://localhost:5000/api/auth"
// Signup API Call
export const signup = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      body: formData, // Includes user details and optional photo
    });

    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Login API Call
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
