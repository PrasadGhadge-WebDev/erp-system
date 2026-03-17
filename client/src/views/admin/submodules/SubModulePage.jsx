import { useEffect, useMemo, useState } from "react";
import Card from "components/card";
import { apiFetch } from "api/client";

const formatValue = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return value.map((item) => formatValue(item)).join(", ");
  }
  if (typeof value === "object") {
    const preferredKeys = [
      "name",
      "company_name",
      "role_name",
      "product_name",
      "warehouse_name",
      "department_name",
      "order_number",
      "invoice_number",
      "employee_code",
      "email",
    ];
    for (const key of preferredKeys) {
      if (value[key]) return String(value[key]);
    }
    if (value._id) return String(value._id);
    return JSON.stringify(value);
  }
  return String(value);
};

const buildInitialValues = (fields) =>
  fields.reduce((acc, field) => {
    if (field.type === "section") return acc;
    acc[field.name] =
      field.defaultValue !== undefined && field.defaultValue !== null
        ? field.defaultValue
        : field.type === "boolean"
        ? false
        : "";
    return acc;
  }, {});

const buildSectionGroups = (fields) => {
  const groups = [];
  let current = {
    title: "Settings",
    helper: "",
    fields: [],
  };
  let hasSections = false;

  for (const field of fields) {
    if (field.type === "section") {
      hasSections = true;
      if (current.fields.length > 0) {
        groups.push(current);
      }
      current = {
        title: field.label || field.name,
        helper: field.helper || "",
        fields: [],
      };
      continue;
    }
    current.fields.push(field);
  }

  if (current.fields.length > 0) {
    groups.push(current);
  }

  return hasSections ? groups : [];
};

const resolveCreateEndpoint = (template, values) => {
  if (!template) return "";
  return template.replace(/:([a-zA-Z0-9_]+)/g, (_match, key) => {
    const value = values[key];
    return value ? encodeURIComponent(String(value)) : "";
  });
};

const SubModulePage = ({
  title,
  parent,
  endpoint,
  formFields = [],
  createEndpoint,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const initialValues = useMemo(
    () => buildInitialValues(formFields),
    [formFields]
  );
  const sectionGroups = useMemo(
    () => buildSectionGroups(formFields),
    [formFields]
  );

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const loadRows = async () => {
    if (!endpoint) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(endpoint);
      const normalized = Array.isArray(data) ? data : data ? [data] : [];
      setRows(normalized);
    } catch (err) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!endpoint) return;
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(endpoint);
        if (!active) return;
        const normalized = Array.isArray(data) ? data : data ? [data] : [];
        setRows(normalized);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Failed to load data");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [endpoint]);

  const columns =
    rows.length > 0
      ? Object.keys(rows[0]).filter(
          (key) => key !== "__v" && key !== "password"
        )
      : [];

  const effectiveCreateEndpoint =
    createEndpoint === null ? null : createEndpoint || endpoint;
  const hasForm = formFields.length > 0 && effectiveCreateEndpoint;

  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const payload = {};
    for (const field of formFields) {
      if (field.type === "section") continue;
      if (field.inPath) continue;
      const rawValue = formValues[field.name];
      if (rawValue === "" || rawValue === null || rawValue === undefined) {
        continue;
      }
      if (field.type === "number") {
        const numeric = Number(rawValue);
        if (!Number.isNaN(numeric)) payload[field.name] = numeric;
        continue;
      }
      if (field.type === "boolean") {
        payload[field.name] = Boolean(rawValue);
        continue;
      }
      if (field.type === "json") {
        try {
          payload[field.name] = JSON.parse(rawValue);
        } catch (err) {
          throw new Error(
            `Invalid JSON for ${field.label || field.name}`
          );
        }
        continue;
      }
      payload[field.name] = rawValue;
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!effectiveCreateEndpoint) return;
    setFormError("");
    setFormSuccess("");

    const missingPathFields = formFields.filter(
      (field) => field.inPath && !formValues[field.name]
    );
    if (missingPathFields.length > 0) {
      setFormError(
        `Please provide ${missingPathFields
          .map((field) => field.label || field.name)
          .join(", ")}.`
      );
      return;
    }

    let payload;
    try {
      payload = buildPayload();
    } catch (err) {
      setFormError(err?.message || "Invalid form data");
      return;
    }

    const resolvedEndpoint = resolveCreateEndpoint(
      effectiveCreateEndpoint,
      formValues
    );
    if (!resolvedEndpoint) {
      setFormError("Create endpoint is not configured.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch(resolvedEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setFormSuccess("Saved successfully.");
      setFormValues(initialValues);
      await loadRows();
    } catch (err) {
      setFormError(err?.message || "Failed to save data");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = formValues[field.name];
    const label = field.label || field.name;
    const isRequired = field.required;
    const commonLabel = (
      <label className="ml-1 text-sm font-semibold text-navy-700 dark:text-white">
        {label}
        {isRequired ? " *" : ""}
      </label>
    );

    if (field.type === "section") {
      return (
        <div
          key={field.name}
          className="pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white/60"
        >
          {label}
          {field.helper ? (
            <p className="mt-1 text-xs font-normal text-gray-500 dark:text-white/50">
              {field.helper}
            </p>
          ) : null}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.name} className="flex flex-col gap-2">
          {commonLabel}
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white"
          >
            <option value="">Select</option>
            {(field.options || []).map((option) => {
              const resolved =
                typeof option === "string"
                  ? { label: option, value: option }
                  : option;
              return (
                <option key={resolved.value} value={resolved.value}>
                  {resolved.label}
                </option>
              );
            })}
          </select>
          {field.helper ? (
            <p className="text-xs text-gray-500 dark:text-white/50">
              {field.helper}
            </p>
          ) : null}
        </div>
      );
    }

    if (field.type === "textarea" || field.type === "json") {
      return (
        <div key={field.name} className="flex flex-col gap-2">
          {commonLabel}
          <textarea
            rows={field.type === "json" ? 4 : 3}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder || ""}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white"
          />
          {field.helper ? (
            <p className="text-xs text-gray-500 dark:text-white/50">
              {field.helper}
            </p>
          ) : null}
        </div>
      );
    }

    if (field.type === "boolean") {
      return (
        <div
          key={field.name}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-white/10 dark:bg-navy-800 dark:text-white"
        >
          <div className="flex flex-col">
            <span className="font-semibold">{label}</span>
            {field.helper ? (
              <span className="text-xs text-gray-500 dark:text-white/50">
                {field.helper}
              </span>
            ) : null}
          </div>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleInputChange(field.name, e.target.checked)}
            className="h-4 w-4"
          />
        </div>
      );
    }

    const inputType =
      field.type === "number"
        ? "number"
        : field.type === "email"
        ? "email"
        : field.type === "date"
        ? "date"
        : field.type === "datetime"
        ? "datetime-local"
        : field.type === "password"
        ? "password"
        : "text";

    return (
      <div key={field.name} className="flex flex-col gap-2">
        {commonLabel}
        <input
          type={inputType}
          value={value}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          placeholder={field.placeholder || ""}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white"
        />
        {field.helper ? (
          <p className="text-xs text-gray-500 dark:text-white/50">
            {field.helper}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card extra="p-6">
        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-white/70">
          {parent}
        </p>
        <p className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
          {title}
        </p>
        {endpoint ? (
          <p className="mt-1 text-xs text-gray-500 dark:text-white/60">
            {endpoint}
          </p>
        ) : null}
      </Card>

      <div
        className={`grid min-w-0 gap-6 ${
          hasForm ? "lg:grid-cols-[minmax(0,360px)_1fr]" : "grid-cols-1"
        }`}
      >
        {hasForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="text-lg font-semibold text-navy-700 dark:text-white">
              New {title}
            </p>

            {sectionGroups.length > 0 ? (
              sectionGroups.map((group, index) => (
                <Card key={`${group.title}-${index}`} extra="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-navy-700 dark:text-white">
                      {group.title}
                    </p>
                  </div>
                  {group.helper ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-white/60">
                      {group.helper}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-col gap-4">
                    {group.fields.map((field) => renderField(field))}
                  </div>
                </Card>
              ))
            ) : (
              <Card extra="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-navy-700 dark:text-white">
                    New {title}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {formFields.map((field) => renderField(field))}
                </div>
              </Card>
            )}

            <Card extra="p-6">
              {formError ? (
                <p className="text-sm text-red-500">{formError}</p>
              ) : null}
              {formSuccess ? (
                <p className="text-sm text-green-500">{formSuccess}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 h-11 w-full rounded-xl bg-brand-500 text-sm font-semibold text-white transition duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </Card>
          </form>
        ) : null}

        <Card extra="p-6 min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-navy-700 dark:text-white">
              Records
            </p>
            {endpoint ? (
              <button
                type="button"
                onClick={loadRows}
                className="text-xs font-semibold text-brand-500 hover:text-brand-600"
              >
                Refresh
              </button>
            ) : null}
          </div>
          {loading ? (
            <p className="text-sm text-gray-600 dark:text-white/70">
              Loading...
            </p>
          ) : error ? (
            <p className="text-sm text-red-500">
              {error.includes("Not authorized")
                ? "Please sign in to view this data."
                : error}
            </p>
          ) : !endpoint ? (
            <p className="text-sm text-gray-600 dark:text-white/70">
              No endpoint configured.
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-white/70">
              No data available.
            </p>
          ) : (
            <div className="w-full min-w-0 overflow-x-auto">
              <table className="min-w-max text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-white/60"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row._id || i}
                      className="border-b border-gray-100 dark:border-white/5"
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-white/80"
                        >
                          {formatValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SubModulePage;
