import Card from "components/card";
import { apiFetch } from "api/client";
import React, { useEffect, useMemo, useState } from "react";

const roleOptions = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
];

const Upload = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [rolesData, usersData] = await Promise.all([
        apiFetch("/api/roles"),
        apiFetch("/api/users"),
      ]);

      const roleMap = rolesData.reduce((acc, role) => {
        acc[role.role_name] = role;
        return acc;
      }, {});

      setRoles(roleMap);
      setUsers(usersData);
    } catch (err) {
      setError(err?.message || "Failed to load users or roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const roleAvailability = useMemo(() => {
    const missing = roleOptions.filter((role) => !roles[role.value]);
    return {
      missing,
      ready: missing.length === 0,
    };
  }, [roles]);

  const handleRoleChange = async (user, roleName) => {
    const role = roles[roleName];
    if (!role) {
      setError(`Role "${roleName}" is not available.`);
      return;
    }

    if (user.role_id?.role_name === roleName) {
      return;
    }

    setSaving((prev) => ({ ...prev, [user._id]: true }));
    setError("");
    try {
      const updated = await apiFetch(`/api/users/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role_id: role._id }),
      });

      setUsers((prev) =>
        prev.map((item) => (item._id === user._id ? updated : item))
      );
    } catch (err) {
      setError(err?.message || "Failed to update role");
    } finally {
      setSaving((prev) => ({ ...prev, [user._id]: false }));
    }
  };

  return (
    <Card extra="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-navy-700 dark:text-white">
            User Role Assignment
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-white/60">
            Assign Super Admin or Admin roles using the checkboxes.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="text-xs font-semibold text-brand-500 hover:text-brand-600"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-3 text-sm text-gray-600 dark:text-white/70">
          Loading users...
        </p>
      ) : !roleAvailability.ready ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          Missing roles: {roleAvailability.missing.map((r) => r.label).join(", ")}
        </div>
      ) : users.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600 dark:text-white/70">
          No users found.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {users.map((user) => {
            const currentRole = user.role_id?.role_name || "";
            return (
              <div
                key={user._id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-white/10 dark:bg-navy-800 dark:text-white/80"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-navy-700 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/60">
                      {user.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-lightPrimary px-3 py-1 text-xs font-semibold text-brand-500 dark:bg-white/10 dark:text-white">
                    {currentRole || "No Role"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {roleOptions.map((role) => (
                    <label
                      key={role.value}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/80"
                    >
                      <input
                        type="checkbox"
                        checked={currentRole === role.value}
                        onChange={() => handleRoleChange(user, role.value)}
                        disabled={saving[user._id]}
                        className="h-4 w-4"
                      />
                      <span>{role.label}</span>
                    </label>
                  ))}
                  {saving[user._id] ? (
                    <span className="text-xs text-gray-500 dark:text-white/60">
                      Updating...
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default Upload;
