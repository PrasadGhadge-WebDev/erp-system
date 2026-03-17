/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import { MdRemove, MdLogout, MdHelpOutline, MdPerson } from "react-icons/md";
import { HiChevronDown } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";
import logo from "assets/img/logo/ERP_Logo.png";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/sign-in");
  };

  const avatarSrc =
    user?.profile_photo && typeof user.profile_photo === "string"
      ? user.profile_photo.startsWith("http")
        ? user.profile_photo
        : user.profile_photo.startsWith("/")
          ? user.profile_photo
          : `/${user.profile_photo}`
      : null;
  const initials =
    user?.name && typeof user.name === "string" && user.name.trim().length > 0
      ? user.name.trim()[0].toUpperCase()
      : "U";

  return (
    <div
      className={`fixed z-50 flex h-screen w-[270px] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 dark:border-white/10 dark:bg-navy-800 dark:text-white
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Close button (mobile) */}
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <MdRemove className="h-5 w-5" />
      </span>

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6 dark:border-white/10">
        <div className="flex items-center gap-4">

          {/* Logo Container */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-[2px] shadow-lg shadow-cyan-500/30">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white dark:bg-navy-1000">
              <img
                src={logo}
                alt="ERP Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-navy-700 dark:text-white">
              ERP SYSTEM
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Enterprise Resource Planning
            </span>

            <span className="mt-1 w-fit rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:bg-white/10 dark:text-white/70">
              v1.0.0
            </span>
          </div>

        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          <Links routes={routes} />
        </ul>
      </div>

      {/* User menu (dropdown up) */}
      <div
        ref={menuRef}
        className="relative border-t border-gray-200 px-3 py-4 dark:border-white/10"
      >
        <div
          id="sidebar-user-menu"
          className={`absolute bottom-16 left-3 right-3 origin-bottom rounded-2xl border border-gray-200 bg-white p-3 shadow-xl transition-all duration-200 dark:border-white/10 dark:bg-navy-800 ${
            userMenuOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <div className="flex items-center gap-3 rounded-xl bg-navy-800 px-3 py-3 text-white dark:bg-navy-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-lg font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{user?.name || "User"}</p>
              <p className="truncate text-xs text-white/70">
                {user?.email || "email@example.com"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <Link
              to="/admin/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-white/80 dark:hover:bg-white/10"
              onClick={() => setUserMenuOpen(false)}
            >
              <MdPerson className="h-4 w-4" />
              My Profile
            </Link>
            <Link
              to="/admin/administration/business-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-white/80 dark:hover:bg-white/10"
              onClick={() => setUserMenuOpen(false)}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-semibold">
                ?
              </span>
              Business Settings
            </Link>
            <a
              href="mailto:support@example.com"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-white/80 dark:hover:bg-white/10"
              onClick={() => setUserMenuOpen(false)}
            >
              <MdHelpOutline className="h-4 w-4" />
              Help & Support
            </a>
          </div>

          <div className="mt-3 border-t border-gray-200 pt-2 dark:border-white/10">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-white/10"
              onClick={handleLogout}
            >
              <MdLogout className="h-4 w-4" />
              Logout
            </button>
          </div>

          <div className="mt-3 flex justify-center text-[11px] font-semibold text-gray-400 dark:text-white/60">
            v1.0.0
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl bg-white px-3 py-3 text-left shadow-sm transition hover:bg-gray-50 dark:bg-navy-800 dark:hover:bg-navy-700"
          onClick={() => setUserMenuOpen((prev) => !prev)}
          aria-expanded={userMenuOpen}
          aria-controls="sidebar-user-menu"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-white">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold">{initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-700 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-white/60">
                {user?.role || "Role"}
              </p>
            </div>
          </div>
          <HiChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform dark:text-white/70 ${
              userMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
