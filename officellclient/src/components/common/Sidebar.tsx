import { useEffect, useRef, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { FaFireAlt } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { BiMessageDetail } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

import useVentStore from "../../store/ventStore";
import useCompanyStore from "../../store/companyStore";
import useUserStore from "../../store/userStore";
import useProfileVentStore from "../../store/profileventStore";
import useTrendingVentStore from "../../store/trendingventStore";
import useCompanyVentStore from "../../store/companyventStore";

import RefreshFeed from "../vent/RefreshFeed";
import RefreshCompanies from "../company/RefreshCompanies";

export const Sidebar = () => {
  const navigate = useNavigate();
  const page = useLocation();

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Close drawer when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        open &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Logout
  const logoutVent = useVentStore((state) => state.logout);
  const logoutProfileVent = useProfileVentStore((state) => state.logout);
  const logoutCompanyVent = useCompanyVentStore((state) => state.logout);
  const logoutTrendingVent = useTrendingVentStore((state) => state.logout);
  const logoutCompanies = useCompanyStore((state) => state.logout);
  const resetUser = useUserStore((state) => state.reset);

  const handleLogout = () => {
    logoutVent();
    logoutProfileVent();
    logoutCompanyVent();
    logoutTrendingVent();
    logoutCompanies();
    resetUser();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center cursor-pointer p-2 mt-2 ms-3 text-sm text-white rounded-lg sm:hidden"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="white"
          viewBox="0 0 20 20"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* BACKDROP */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 sm:hidden" />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-950 border-r border-gray-700 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 flex flex-col justify-between">
          {/* Logo */}
          <h1 className="text-4xl mt-4 font-arimo text-white font-bold tracking-tight">
            ⟢ OFFICELL
          </h1>

          <ul className="space-y-5 font-medium ">

            {/* Feed */}
            <li>
              <a
                href="/feed"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-700
                ${page.pathname === "/feed" ? "bg-gray-50 text-gray-950" : "text-white"}`}
              >
                <BiMessageDetail className="text-[22px]" />
                <span className="ml-3 text-[18px] font-light">Feed</span>
              </a>
            </li>

            {/* Trending */}
            <li>
              <a
                href="/trending"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-700
                ${page.pathname === "/trending" ? "bg-gray-50 text-gray-950" : "text-white"}`}
              >
                <FaFireAlt className="text-[22px]" />
                <span className="ml-3 text-[18px] font-light">Trending</span>
              </a>
            </li>

            {/* Companies */}
            <li>
              <a
                href="/companies"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-700
                ${page.pathname === "/companies" ? "bg-gray-50 text-gray-950" : "text-white"}`}
              >
                <RiBuilding2Line className="text-[22px]" />
                <span className="ml-3 text-[18px] font-light">Companies</span>
              </a>
            </li>

            {/* Profile */}
            <li>
              <a
                href="/profile"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-700
                ${page.pathname === "/profile" ? "bg-gray-50 text-gray-950" : "text-white"}`}
              >
                <VscAccount className="text-[22px]" />
                <span className="ml-3 text-[18px] font-light">Profile</span>
              </a>
            </li>
          </ul>

          {/* Bottom */}
          <div className="flex flex-col items-center space-y-7">
            <RefreshFeed />
            <RefreshCompanies />
            <button
  onClick={handleLogout}
  className="
    border border-white text-white 
    px-6 py-2 text-sm                /* Mobile size */
    sm:px-8 sm:py-3 sm:text-base     /* Tablets */
    md:px-12 md:py-4 md:text-lg      /* Desktop */

    rounded-full tracking-widest uppercase font-bold
    hover:bg-white hover:text-black transition
  "
>
  Logout
</button>
          </div>
        </div>
      </aside>
    </>
  );
};
