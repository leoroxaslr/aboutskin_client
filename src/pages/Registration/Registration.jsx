import * as React from "react";
import { useState } from "react";
import http from "../../lib/http";
import { useNavigate } from "react-router-dom";
import Heeroimage from "../../assets/images/Hero/Heroimage.svg";

const USER_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Registration = () => {
  const navigate = useNavigate();
  const api = http();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState(null); // New state for the uploaded image
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  async function submit(e) {
    e.preventDefault();
    try {
      let image_name = null;
      if (image) {
        const form = new FormData();
        form.append("image", image);

        const response = await api.post("/upload", form);
        image_name = response.data.image;
      }

      const body = {
        username,
        email,
        first_name,
        last_name,
        image: image_name,
        middle_name,
        password,
        password_confirmation,
      };

      const response = await api.post("/register", body);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (e) {
      setError(e.response.data.message);
      setErrors(e.response.data.errors);
    }
  }

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <form onSubmit={submit} className="bg-white p-4 rounded-lg">
            <h2 className="text-2xl mb-8">Register</h2>

            {/* Add this input to your form */}
            <div className="mb-4">
              <label htmlFor="image" className="block">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*" // Restrict file types to images
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Username Input */}
            <div
              className={`mb-4 ${
                errors?.username?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="username" className="block">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.username?.map((error, index) => (
                <p
                  key={index}
                  className="text-sm text-red-500"
                  id="username-error"
                >
                  {error}
                </p>
              ))}
            </div>

            {/* Email Input */}
            <div
              className={`mb-4 ${errors?.email?.length ? "text-red-500" : ""}`}
            >
              <label htmlFor="email" className="block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.email?.map((error, index) => (
                <p
                  key={index}
                  className="text-sm text-red-500"
                  id="email-error"
                >
                  {error}
                </p>
              ))}
            </div>

            {/* First Name Input */}
            <div
              className={`mb-4 ${
                errors?.first_name?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="firstName" className="block">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.first_name?.map((error, index) => (
                <p
                  key={index}
                  className="text-sm text-red-500"
                  id="firstname-error"
                >
                  {error}
                </p>
              ))}
            </div>

            {/* Last Name Input */}
            <div
              className={`mb-4 ${
                errors?.last_name?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="lastName" className="block">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.last_name?.map((error, index) => (
                <p
                  key={index}
                  className="text-sm text-red-500"
                  id="lastname-error"
                >
                  {error}
                </p>
              ))}
            </div>

            {/* Middle Name Input */}
            <div className="mb-4">
              <label htmlFor="middleName" className="block">
                Middle Name
              </label>
              <input
                id="middleName"
                type="text"
                value={middle_name}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Password Input */}
            <div
              className={`mb-4 ${
                errors?.password?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="password" className="block">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.password?.map((error, index) => (
                <p
                  key={index}
                  className="text-sm text-red-500"
                  id="password-error"
                >
                  {error}
                </p>
              ))}
            </div>

            {/* Password Confirmation Input */}
            <div
              className={`mb-4 ${
                errors?.password_confirmation?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="passwordConfirmation" className="block">
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.password_confirmation?.map((error, index) => (
                <p
                  key={index}
                  className="text-sm text-red-500"
                  id="passwordconfirmation-error"
                >
                  {error}
                </p>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
