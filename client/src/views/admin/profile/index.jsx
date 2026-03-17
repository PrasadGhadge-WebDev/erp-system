import { useEffect, useState } from "react";
import Card from "components/card";
import { apiFetch } from "api/client";
import Banner from "./components/Banner";
import General from "./components/General";
import Notification from "./components/Notification";
import Project from "./components/Project";
import Storage from "./components/Storage";
import Upload from "./components/Upload";

const ProfileOverview = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await apiFetch("/api/auth/profile");
        if (active) setProfile(data);
      } catch (err) {
        if (active) setError(err?.message || "Failed to load profile");
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <Card extra="p-6">
        <p className="text-lg font-bold text-navy-700 dark:text-white">
          Profile
        </p>
        {error ? (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        ) : profile ? (
          <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700 dark:text-white/80 md:grid-cols-2">
            <div>
              <span className="font-semibold">Name:</span> {profile.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-semibold">Role:</span> {profile.role || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Company:</span>{" "}
              {profile.company || "N/A"}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-white/70">
            Loading...
          </p>
        )}
      </Card>
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner />
        </div>

        <div className="col-span-3 lg:!mb-0">
          <Storage />
        </div>

        <div className="z-0 col-span-5 lg:!mb-0">
          <Upload />
        </div>
      </div>
      {/* all project & ... */}

      <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
          <Project />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General />
        </div>

        <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
          <Notification />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
