import React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import http from "../../lib/http";
import Heeroimage from "../../assets/images/Hero/Heroimage.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const body = {
        username,
        password,
      };
      const api = http();
      const user = await api.post("/login", body);
      localStorage.setItem("token", user.data.token);
      localStorage.setItem("user", JSON.stringify(user.data.user));
      window.dispatchEvent(new Event("authenticated"));
      navigate("/");
      console.log(user.data.user, user.data.token);
    } catch (e) {
      setError(e.response.data.message);
    }
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <form onSubmit={submit} className="bg-white p-4 rounded-lg">
            <h2 className="text-2xl mb-8">Login</h2>

            <div className="mb-4">
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
            </div>

            <div className="mb-4">
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
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Login
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                as={Link}
                to="/register"
                className="pl-1 font-medium text-gray-800 hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
