import { apiRequest } from "./client";

export const getCompanies = () => apiRequest("/companies");
export const getUsers = () => apiRequest("/users");
export const getCustomers = () => apiRequest("/customers");
export const getLeads = () => apiRequest("/leads");

export const getCategories = () => apiRequest("/inventory/categories");
export const getProducts = () => apiRequest("/inventory/products");
export const getWarehouses = () => apiRequest("/inventory/warehouses");
export const getStockMovements = () => apiRequest("/inventory/stock-movements");

export const getSuppliers = () => apiRequest("/purchase/suppliers");
export const getPurchaseOrders = () => apiRequest("/purchase/orders");
export const getPurchaseItems = (order_id) =>
  apiRequest(`/purchase/items${order_id ? `?order_id=${order_id}` : ""}`);
export const getSalesOrders = () => apiRequest("/sales/orders");
export const getSalesItems = (order_id) =>
  apiRequest(`/sales/items${order_id ? `?order_id=${order_id}` : ""}`);

export const getInvoices = () => apiRequest("/finance/invoices");
export const getPayments = () => apiRequest("/finance/payments");

export const getDepartments = () => apiRequest("/hr/departments");
export const getEmployees = () => apiRequest("/hr/employees");
export const getAttendance = (employee_id) =>
  apiRequest(`/hr/attendance${employee_id ? `?employee_id=${employee_id}` : ""}`);
export const getLeaveRequests = (employee_id) =>
  apiRequest(`/hr/leaves${employee_id ? `?employee_id=${employee_id}` : ""}`);

export const getRoles = () => apiRequest("/roles");
export const getActivityLogs = () => apiRequest("/activity-logs");
