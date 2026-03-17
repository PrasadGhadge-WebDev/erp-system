import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiSearch } from "react-icons/fi";
import { MdMenu, MdRemove } from "react-icons/md";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import avatar from "assets/img/avatars/avatar4.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const { onToggleSidenav, isSidenavOpen } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const [user, setUser] = useState(null);
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
      : avatar;

  return (
    <nav className="sticky top-4 z-40 w-full rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="relative mt-[3px] flex h-[61px] w-full items-center justify-between gap-4 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center justify-center rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
            onClick={onToggleSidenav}
            aria-label={isSidenavOpen ? "Close sidebar" : "Open sidebar"}
            title={isSidenavOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidenavOpen ? (
              <MdRemove className="h-5 w-5" />
            ) : (
              <MdMenu className="h-5 w-5" />
            )}
          </button>
          <div className="text-lg font-bold uppercase text-navy-700 dark:text-white">
            ERP System
          </div>
        </div>

        <div className="flex h-full max-w-[520px] flex-1 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white">
          <p className="text-xl pe-2 ps-3">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <Dropdown
            button={
              <p className="cursor-pointer">
                <IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-white" />
              </p>
            }
            children={
              <div className="flex w-[320px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-white/70">
                  No new notifications.
                </p>
              </div>
            }
            classNames={"py-2 top-8 left-0 -start-[200px] w-max"}
          />
          <Dropdown
            button={
              <p className="cursor-pointer">
                <IoChatbubbleOutline className="h-5 w-5 text-gray-600 dark:text-white" />
              </p>
            }
            children={
              <div className="flex w-[320px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Messages
                </p>
                <p className="text-sm text-gray-600 dark:text-white/70">
                  No new messages.
                </p>
              </div>
            }
            classNames={"py-2 top-8 left-0 -start-[200px] w-max"}
          />
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              if (darkmode) {
                document.body.classList.remove("dark");
                setDarkmode(false);
              } else {
                document.body.classList.add("dark");
                setDarkmode(true);
              }
            }}
          >
            {darkmode ? (
              <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
            )}
          </div>
          <Dropdown
            button={
              <div className="flex items-center gap-2">
                <img className="h-9 w-9 rounded-full" src={avatarSrc} alt="Admin" />
                <span className="text-sm font-semibold text-navy-700 dark:text-white">
                  {user?.name || "Admin"}
                </span>
              </div>
            }
            children={
              <div className="flex w-48 flex-col rounded-[16px] bg-white p-3 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                <Link
                  to="/admin/profile"
                  className="rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-white/10"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            }
            classNames={"py-2 top-8 left-0 -start-[60px] w-max"}
            closeOnSelect
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
