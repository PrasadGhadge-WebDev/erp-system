import { Link } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

const SidebarCard = () => {
  const { user } = useAuth();
  const company =
    user?.company?.company_name ||
    user?.company ||
    user?.company_id?.company_name ||
    "Your Company";
  const role =
    user?.role?.role_name || user?.role || user?.role_id?.role_name || "Member";

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-navy-700/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-xs font-semibold text-white">
          WS
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-300">
            Workspace
          </p>
          <p className="text-sm font-semibold text-navy-700 dark:text-white">
            {company}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <span>Role</span>
        <span className="font-semibold text-navy-700 dark:text-white">
          {role}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <span>Status</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
          Active
        </span>
      </div>

      <Link
        to="/admin/profile"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
      >
        View Profile
      </Link>
    </div>
  );
};

export default SidebarCard;
