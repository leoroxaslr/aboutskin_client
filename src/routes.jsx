import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/ProfileDash/Profile";
import Level2 from "./pages/Level2/Level2";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Userdash from "./pages/Profile/Settings/Userdash";
import Orders from "./pages/Profile/Settings/Orders";
import React from "react";
import Item from "./pages/Product/Item";
import Checkout from "./pages/Checkout/Checkout";
import Admin from "./pages/Profile/Settings/Admin";
import ProcessOrder from "./pages/Profile/Settings/ProcessOrder";

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
    path: "/checkout",
    name: "checkout",
    element: <Checkout />,
  },
  {
    path: "/item/:id",
    name: "item",
    component: { Item },
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
      path: "userdash",
      name: "Userdash",
      element: <Userdash />,
    },
    {
      path: "admin",
      name: "Admin",
      element: <Admin />,
    },
    {
      path: "admin/orders",
      name: "Admin",
      element: <ProcessOrder />,
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
