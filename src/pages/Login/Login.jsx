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
      window.location.reload(false);
    } catch (e) {
      setError(e.response.data.message);
    }
  }

  return (
    <>
      <div className="hero min-h-screen">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 border">
          <form onSubmit={submit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </div>
            <p className="text-sm font-light text-gray-800">
              Don’t have an account yet?
              <Link
                to="/register"
                className="pl-1 font-medium text-gray-800 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
