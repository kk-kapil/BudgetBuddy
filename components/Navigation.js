"use client";

import { IoMdStats } from "react-icons/io";
import { useContext } from "react";
import { authContext } from "@/lib/store/authContext";

function Nav() {
  const { user, loading, logout } = useContext(authContext);

  return (
    <header className="container max-w-2xl px-6 py-6 mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {user && !loading && (
            <>
              <div className="h-16 w-16 rounded-full overflow-hidden">
                {/* Image */}
                <img
                  className="object-cover w-full h-full"
                  src={user.photoURL}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Name */}
              <small className="ml-4 text-sm">Hi, {user.displayName}</small>
            </>
          )}
        </div>

        {user && !loading && (
          <nav className="flex items-center gap-4">
            <div>
              <a href="#stats">
                <IoMdStats className="text-2xl" />
              </a>
            </div>
            <div>
              <button onClick={logout} className="btn btn-danger">
                Sign Out
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Nav;
