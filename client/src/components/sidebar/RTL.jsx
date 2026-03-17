/* eslint-disable */

import { MdRemove } from "react-icons/md";
import Links from "./components/Links";
import routes from "routes.js";
import logo from "assets/img/logo/ERP_Logo.png";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:hidden duration-175 linear fixed z-50 flex h-screen w-[270px] flex-col border-r border-gray-200 bg-white shadow-xl transition-all dark:border-white/10 dark:bg-navy-800 dark:text-white md:z-50 lg:z-50 xl:z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      {/* Close button (mobile) */}
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <MdRemove className="h-5 w-5" />
      </span>

      {/* Fixed Header */}
      <div className="shrink-0 border-b border-gray-200 px-6 py-6 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 dark:ring-white/10" />
            <img
              src={logo}
              alt="ERP Logo"
              className="relative z-10 h-10 w-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-navy-700 dark:text-white">
              ERP SYSTEM
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Enterprise Resource Planning
            </span>
            <span className="mt-1 w-fit rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 dark:bg-white/10 dark:text-white/70">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Menu */}
      <div
        className="flex-1 overflow-y-auto px-3 py-5"
        style={{ scrollbarGutter: "stable" }}
      >
        <ul className="space-y-1">
          <Links routes={routes} />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
