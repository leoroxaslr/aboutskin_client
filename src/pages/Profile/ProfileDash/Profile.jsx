import { Link } from "react-router-dom"; // Use Link for navigation
import { useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const imageLink = import.meta.env.VITE_API;
  const isAdmin = user.is_admin === true;

  return (
    <>
      <div className="container w-10/12 mx-auto my-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="bg-white rounded shadow p-4">
              <div className="flex justify-start">
                <div className="w-10 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user.image
                        ? `${imageLink}/public/images/${user.image}`
                        : ""
                    }
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:opacity-75 rounded-xl"
                  />
                </div>
                <div className="mx-5 text-secondary">
                  <div className="text-neutral text-xs">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-gray-500">{user.username}</div>
                </div>
              </div>
              <div className="divider"></div>
              <ul>
                <li>
                  <Link
                    to="/profile/userdash"
                    className="text-gray-500 hover:underline"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile/orders"
                    className="text-gray-500 hover:underline"
                  >
                    My Purchases
                  </Link>
                </li>
              </ul>
              <div className="divider"></div>
              <ul>
                {isAdmin && (
                  <Link
                    to="/profile/admin"
                    className="text-gray-500 hover:underline"
                  >
                    My Products
                  </Link>
                )}
              </ul>
              <ul>
                {isAdmin && (
                  <Link
                    to="/profile/admin"
                    className="text-gray-500 hover:underline"
                  >
                    Add New Products
                  </Link>
                )}
              </ul>
              <ul>
                {isAdmin && (
                  <Link
                    to="/profile/admin/orders"
                    className="text-gray-500 hover:underline"
                  >
                    Orders
                  </Link>
                )}
              </ul>
              <div className="divider"></div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <div className="bg-white rounded shadow p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
