import { apiRequest } from "./client";

export const login = (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

export const register = ({ name, email, password, company_name, phone }) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password, company_name, phone },
  });
};

export const fetchProfile = () => {
  return apiRequest("/auth/profile");
};
