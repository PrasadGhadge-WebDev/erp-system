const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

const getStoredToken = () => {
  try {
    return localStorage.getItem("erp_token");
  } catch (error) {
    return null;
  }
};

const buildUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    token = getStoredToken(),
  } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (isFormData) {
    delete requestHeaders["Content-Type"];
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      (data && data.message) || data || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
