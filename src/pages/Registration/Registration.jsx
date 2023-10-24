import * as React from "react";
import { useState } from "react";
import http from "../../lib/http";
import { Link } from "react-router-dom";
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
  const [isAdmin, setIsAdmin] = useState(0);
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
      <div className="container mx-auto py-10 max-w-3xl">
        <form onSubmit={submit} className="bg-white p-4 rounded-2xl border m-2">
          <h2 className="text-2xl font-semibold leading-7 text-gray-900 mb-1">
            Register
          </h2>
          <p className="label-text text-sm mb-3 leading-6 text-gray-600">
            Basic information
          </p>
          <div className="grid gap-4 label-text sm:grid-cols-2">
            <div
              className={`label-text ${
                errors?.username?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="username" className="label-text">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full max-w-xs justify-end"
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
              className={`label-text ${
                errors?.email?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="email" className="label-text">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full max-w-xs"
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
              className={`label-text ${
                errors?.first_name?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="firstName" className="label-text">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full max-w-xs"
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
              className={`label-text ${
                errors?.last_name?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="lastName" className="label-text">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full max-w-xs"
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
              className={`label-text ${
                errors?.phoneNum?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="phoneNum" className="label-text">
                Phone Number
              </label>
              <input
                id="phoneNum"
                type="text"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                className="input input-bordered w-full max-w-xs"
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
            <div className="block">
              <label htmlFor="postal" className="label-text">
                Postal Code
              </label>
              <input
                id="postal"
                type="text"
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            {/* Address Input */}
            <div className="block col-span-1 md:col-span-2">
              <label htmlFor="address" className="label-text">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div
              className={`label-text ${
                errors?.password?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full max-w-xs"
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
              className={`${
                errors?.password_confirmation?.length ? "text-red-500" : ""
              }`}
            >
              <label htmlFor="passwordConfirmation" className="label-text">
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="input input-bordered w-full max-w-xs"
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
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="image" className="label-text">
                Profile Image
              </label>
              <div className="w-full h-40 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className={`file-input file-input-ghost w-full max-w-xs ${
                    imageError ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
            </div>
            <div className="col-span-1 md:col-span-2 ">
              <button
                type="submit"
                className="btn btn-primary btn-block my-auto"
              >
                Register
              </button>
            </div>

            <div className="flex col-span-1 md:col-span-2 justify-between">
              <div className="col-span-1 md:col-span-2 flex text-gray-100">
                <label className="block">
                  Is Admin?
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="ml-2 checkbox"
                    disabled={!isSecretPinCorrect}
                  />
                </label>
              </div>
              <div className="col-span-1 md:col-span-2 flex">
                <label htmlFor="secretPin" className="label-text text-gray-100">
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
                  className="input input-bordered w-full max-w-xs border-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse my-3">
            <p className="text-sm font-light text-gray-800">
              Already have an account?
              <Link
                to="/login"
                className="pl-1 font-medium text-gray-800 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registration;
