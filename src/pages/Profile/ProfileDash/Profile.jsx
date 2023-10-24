import { Link } from "react-router-dom";
import { useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const imageLink = import.meta.env.VITE_API;
  const isAdmin = user.is_admin === true || user.is_admin === 1;

  return (
    <>
      <div className="container w-10/12 mx-auto my-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="rounded shadow-md p-4 border">
              <div className="flex ">
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        user.image
                          ? `${imageLink}/public/images/${user.image}`
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="mx-5 text-secondary">
                  <div className="text-gray-500 text-lg font-bold">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-gray-400 text-sm">{user.username}</div>
                </div>
              </div>
              <div className="mx-auto flex flex-col">
                <div className="divider"></div>
                <ul>
                  <li>
                    <Link
                      to="/profile/userdash"
                      className=" hover:underline leading-6 text-gray-500"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile/orders"
                      className="hover:underline leading-6 text-gray-500"
                    >
                      My Purchases
                    </Link>
                  </li>
                </ul>
                <div className="divider"></div>
                <ul>
                  {isAdmin && (
                    <Link
                      to="/profile/admin/dashboard"
                      className=" hover:underline leading-6 text-gray-500"
                    >
                      Dashboard
                    </Link>
                  )}
                </ul>
                <ul>
                  {isAdmin && (
                    <Link
                      to="/profile/admin/update"
                      className=" hover:underline leading-6 text-gray-500"
                    >
                      My Products
                    </Link>
                  )}
                </ul>
                <ul>
                  {isAdmin && (
                    <Link
                      to="/profile/admin"
                      className="hover:underline leading-6 text-gray-500"
                    >
                      Add New Products
                    </Link>
                  )}
                </ul>
                <ul>
                  {isAdmin && (
                    <Link
                      to="/profile/admin/orders"
                      className=" hover:underline leading-6 text-gray-500"
                    >
                      Orders
                      <div className="divider"></div>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="sm:col-span-3">
            <div className="bg-white rounded shadow p-4 border h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
