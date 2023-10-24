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
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretPin, setSecretPin] = useState("");
  const [isSecretPinCorrect, setIsSecretPinCorrect] = useState(false);

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
        password,
        password_confirmation,
        phone_num: phoneNum,
        address,
        postal,
        is_admin: isAdmin,
        image: image_name,
      };

      const response = await api.post("/register", body);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
      window.location.reload(true);
    } catch (e) {
      // Check if the error response contains validation errors
      if (e.response && e.response.data && e.response.data.errors) {
        setErrors(e.response.data.errors);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validImageTypes.includes(selectedImage.type)) {
        setImage(selectedImage);
        setImageError(""); // Clear the error message if an image is valid
      } else {
        setImage(null);
        setImageError(
          "Invalid image type. Please choose a JPEG, PNG, or GIF file."
        );
      }
    }
  };
  const validSecretPin = "1234";
  return (
    <>
      <div className="flex  items-center justify-center">
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
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className={`w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-500 ${
                  imageError ? "border-red-500" : ""
                }`}
                required
              />
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
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
              {errors?.username &&
                errors.username.map((error, index) => (
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
              {errors?.email &&
                errors.email.map((error, index) => (
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
              {errors?.first_name &&
                errors.first_name.map((error, index) => (
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
              {errors?.last_name &&
                errors.last_name.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm text-red-500"
                    id="lastname-error"
                  >
                    {error}
                  </p>
                ))}
            </div>

            {/* Phone Number Input */}
            <div
              className={`mb-4 ${
                errors?.phoneNum?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="phoneNum" className="block">
                Phone Number
              </label>
              <input
                id="phoneNum"
                type="text"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {errors?.phoneNum &&
                errors.phoneNum.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm text-red-500"
                    id="phoneNum-error"
                  >
                    {error}
                  </p>
                ))}
            </div>

            {/* Address Input */}
            <div className="mb-4">
              <label htmlFor="address" className="block">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Postal Input */}
            <div className="mb-4">
              <label htmlFor="postal" className="block">
                Postal Code
              </label>
              <input
                id="postal"
                type="text"
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Admin Checkbox */}
            <div className="mb-4">
              <label className="block">
                Is Admin?
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="ml-2"
                  disabled={!isSecretPinCorrect}
                />
              </label>
            </div>
            {/* Secret Pin Input */}
            <div className="mb-4">
              <label htmlFor="secretPin" className="block">
                Secret Pin
              </label>
              <input
                id="secretPin"
                type="password"
                value={secretPin}
                onChange={(e) => {
                  const enteredPin = e.target.value;
                  setSecretPin(enteredPin);
                  setIsSecretPinCorrect(enteredPin === validSecretPin);
                }}
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
