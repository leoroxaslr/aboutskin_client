import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/ProfileDash/Profile";
import Level2 from "./pages/Level2/Level2";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Userdash from "./pages/Profile/Settings/Userdash";
import Orders from "./pages/Profile/Settings/Orders";
import React from "react";
import Item from "./pages/Product/Item";

export const navRoutes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/store",
    name: "store",
    element: <Level2 />,
  },
  {
    path: "/item",
    name: "item",
    element: <Item />,
  },
];
export const authRoutes = [
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/register",
    name: "Register",
    element: <Registration />,
  },
];

export const profileRoute = {
  path: "/profile",
  name: "Profile",
  element: <Profile />,
  children: [
    {
      path: "Userdash",
      name: "Userdash",
      element: <Userdash />,
    },
    {
      path: "orders",
      name: "Orders",
      element: <Orders />,
    },
  ],
};

const routes = [...navRoutes, ...authRoutes, profileRoute];

export default routes;
