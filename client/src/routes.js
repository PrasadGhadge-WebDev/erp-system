import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import CoreModule from "views/admin/core";
import CrmModule from "views/admin/crm";
import InventoryModule from "views/admin/inventory";
import PurchaseModule from "views/admin/purchase";
import SalesModule from "views/admin/sales";
import FinanceModule from "views/admin/finance";
import HrModule from "views/admin/hr";
import SubModulePage from "views/admin/submodules/SubModulePage";
import RTLDefault from "views/rtl/default";

// Auth Imports
// Auth Imports
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
  MdBusiness,
  MdGroup,
  MdInventory2,
  MdLocalShipping,
  MdShoppingCart,
  MdAccountBalance,
  MdBadge,
} from "react-icons/md";

const leadStatusOptions = ["new", "contacted", "qualified", "lost", "won"];
const movementTypeOptions = ["in", "out", "transfer", "adjustment"];
const purchaseStatusOptions = ["pending", "ordered", "received", "cancelled"];
const attendanceStatusOptions = ["present", "absent", "late", "half_day"];
const leaveStatusOptions = ["pending", "approved", "rejected"];
const businessTypeOptions = [
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Trading", value: "trading" },
  { label: "Service", value: "service" },
];
const taxTypeOptions = [
  { label: "GST", value: "gst" },
  { label: "VAT", value: "vat" },
  { label: "Sales Tax", value: "sales_tax" },
];
const taxInclusionOptions = [
  { label: "Inclusive", value: "inclusive" },
  { label: "Exclusive", value: "exclusive" },
];
const stockValuationOptions = [
  { label: "FIFO", value: "fifo" },
  { label: "LIFO", value: "lifo" },
  { label: "Weighted Average", value: "weighted_average" },
];
const discountTypeOptions = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];
const roundingMethodOptions = [
  { label: "None", value: "none" },
  { label: "Round Up", value: "round_up" },
  { label: "Round Down", value: "round_down" },
  { label: "Nearest", value: "nearest" },
];
const accessLevelOptions = [
  { label: "Viewer", value: "viewer" },
  { label: "Editor", value: "editor" },
  { label: "Manager", value: "manager" },
  { label: "Admin", value: "admin" },
];

const submoduleConfig = {
  "crm/customers": {
    endpoint: "/api/customers",
    formFields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone" },
      { name: "alternate_phone", label: "Alternate Phone" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "city", label: "City" },
      { name: "state", label: "State" },
      { name: "country", label: "Country" },
      { name: "postal_code", label: "Postal Code" },
      { name: "customer_type", label: "Customer Type" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "crm/leads": {
    endpoint: "/api/leads",
    formFields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "source", label: "Source" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: leadStatusOptions,
        defaultValue: "new",
      },
      { name: "assigned_to", label: "Assigned To (User ID)" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "crm/lead-notes": {
    endpoint: "/api/leads/notes",
    createEndpoint: "/api/leads/:lead_id/notes",
    formFields: [
      {
        name: "lead_id",
        label: "Lead ID",
        required: true,
        inPath: true,
      },
      { name: "note", label: "Note", type: "textarea", required: true },
    ],
  },
  "inventory/categories": {
    endpoint: "/api/inventory/categories",
    formFields: [
      { name: "name", label: "Name", required: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  "inventory/products": {
    endpoint: "/api/inventory/products",
    formFields: [
      { name: "category_id", label: "Category ID", required: true },
      { name: "product_name", label: "Product Name", required: true },
      { name: "sku", label: "SKU", required: true },
      { name: "barcode", label: "Barcode" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "cost_price", label: "Cost Price", type: "number", required: true },
      {
        name: "selling_price",
        label: "Selling Price",
        type: "number",
        required: true,
      },
      { name: "stock_quantity", label: "Stock Quantity", type: "number" },
      { name: "minimum_stock", label: "Minimum Stock", type: "number" },
      { name: "unit", label: "Unit" },
    ],
  },
  "inventory/warehouses": {
    endpoint: "/api/inventory/warehouses",
    formFields: [
      { name: "warehouse_name", label: "Warehouse Name", required: true },
      { name: "location", label: "Location" },
      { name: "manager_name", label: "Manager Name" },
      { name: "contact_number", label: "Contact Number" },
    ],
  },
  "inventory/stock-movements": {
    endpoint: "/api/inventory/stock-movements",
    formFields: [
      { name: "product_id", label: "Product ID", required: true },
      { name: "warehouse_id", label: "Warehouse ID", required: true },
      {
        name: "movement_type",
        label: "Movement Type",
        type: "select",
        options: movementTypeOptions,
        required: true,
      },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "reference_type", label: "Reference Type" },
      { name: "reference_id", label: "Reference ID" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "purchase/suppliers": {
    endpoint: "/api/purchase/suppliers",
    formFields: [
      { name: "company_name", label: "Company Name", required: true },
      { name: "contact_person", label: "Contact Person" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "city", label: "City" },
      { name: "country", label: "Country" },
      { name: "tax_number", label: "Tax Number" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "purchase/purchase-orders": {
    endpoint: "/api/purchase/orders",
    formFields: [
      { name: "supplier_id", label: "Supplier ID", required: true },
      { name: "order_number", label: "Order Number", required: true },
      { name: "order_date", label: "Order Date", type: "date", required: true },
      {
        name: "expected_delivery_date",
        label: "Expected Delivery Date",
        type: "date",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: purchaseStatusOptions,
        defaultValue: "pending",
      },
      { name: "notes", label: "Notes", type: "textarea" },
      {
        name: "items",
        label: "Items (JSON)",
        type: "json",
        helper: 'Example: [{"product_id":"...","quantity":1,"price":10}]',
      },
    ],
  },
  "sales/sales-orders": {
    endpoint: "/api/sales/orders",
    formFields: [
      { name: "customer_id", label: "Customer ID", required: true },
      { name: "order_number", label: "Order Number", required: true },
      { name: "order_date", label: "Order Date", type: "date", required: true },
      { name: "discount", label: "Discount", type: "number" },
      { name: "tax_amount", label: "Tax Amount", type: "number" },
      { name: "notes", label: "Notes", type: "textarea" },
      {
        name: "items",
        label: "Items (JSON)",
        type: "json",
        helper: 'Example: [{"product_id":"...","quantity":1,"price":10}]',
      },
    ],
  },
  "finance/invoices": {
    endpoint: "/api/finance/invoices",
    formFields: [
      { name: "sales_order_id", label: "Sales Order ID", required: true },
      { name: "invoice_number", label: "Invoice Number", required: true },
      { name: "invoice_date", label: "Invoice Date", type: "date", required: true },
      { name: "due_date", label: "Due Date", type: "date" },
      { name: "total_amount", label: "Total Amount", type: "number", required: true },
      { name: "tax_amount", label: "Tax Amount", type: "number" },
      { name: "discount_amount", label: "Discount Amount", type: "number" },
    ],
  },
  "finance/payments": {
    endpoint: "/api/finance/payments",
    formFields: [
      { name: "invoice_id", label: "Invoice ID", required: true },
      { name: "payment_method", label: "Payment Method", required: true },
      { name: "transaction_reference", label: "Transaction Reference" },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "payment_date", label: "Payment Date", type: "date", required: true },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "hr/departments": {
    endpoint: "/api/hr/departments",
    formFields: [
      { name: "department_name", label: "Department Name", required: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  "hr/employees": {
    endpoint: "/api/hr/employees",
    formFields: [
      { name: "department_id", label: "Department ID", required: true },
      { name: "employee_code", label: "Employee Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "position", label: "Position", required: true },
      { name: "salary", label: "Salary", type: "number", required: true },
      { name: "join_date", label: "Join Date", type: "date" },
    ],
  },
  "hr/attendance": {
    endpoint: "/api/hr/attendance",
    formFields: [
      { name: "employee_id", label: "Employee ID", required: true },
      {
        name: "attendance_date",
        label: "Attendance Date",
        type: "date",
        required: true,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: attendanceStatusOptions,
        required: true,
      },
      { name: "check_in_time", label: "Check In Time", type: "datetime" },
      { name: "check_out_time", label: "Check Out Time", type: "datetime" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "hr/leave-requests": {
    endpoint: "/api/hr/leaves",
    formFields: [
      { name: "employee_id", label: "Employee ID", required: true },
      { name: "leave_type", label: "Leave Type", required: true },
      { name: "start_date", label: "Start Date", type: "date", required: true },
      { name: "end_date", label: "End Date", type: "date", required: true },
      { name: "reason", label: "Reason", type: "textarea", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: leaveStatusOptions,
        defaultValue: "pending",
      },
    ],
  },
  "administration/companies": {
    endpoint: "/api/companies",
    formFields: [
      { name: "company_name", label: "Company Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "website", label: "Website" },
      { name: "tax_number", label: "Tax Number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
        defaultValue: "active",
      },
    ],
  },
  "administration/business-settings": {
    endpoint: "/api/business-settings",
    formFields: [
      {
        name: "section_company_information",
        label: "Company Information",
        type: "section",
        helper: "Basic details about the company.",
      },
      {
        name: "business_name",
        label: "Company Name",
        required: true,
      },
      { name: "legal_name", label: "Legal Business Name" },
      {
        name: "company_logo",
        label: "Company Logo",
        helper: "URL or file path to the logo.",
      },
      {
        name: "business_type",
        label: "Business Type",
        type: "select",
        options: businessTypeOptions,
      },
      { name: "industry_type", label: "Industry Type" },
      { name: "registration_number", label: "Registration Number" },
      { name: "website", label: "Website" },
      { name: "timezone", label: "Time Zone" },
      { name: "currency", label: "Currency" },
      {
        name: "section_contact_information",
        label: "Contact Information",
        type: "section",
        helper: "Primary and support contacts for the business.",
      },
      { name: "contact_person", label: "Contact Person" },
      { name: "email", label: "Primary Email", type: "email" },
      { name: "phone", label: "Primary Phone" },
      { name: "alternate_phone", label: "Alternate Phone" },
      { name: "support_email", label: "Support Email", type: "email" },
      { name: "support_phone", label: "Support Phone" },
      {
        name: "section_address_information",
        label: "Address Information",
        type: "section",
        helper: "Registered business address details.",
      },
      { name: "address", label: "Company Address", type: "textarea" },
      { name: "city", label: "City" },
      { name: "state", label: "State" },
      { name: "country", label: "Country" },
      { name: "postal_code", label: "Postal Code" },
      {
        name: "section_tax_information",
        label: "Tax Information",
        type: "section",
        helper: "Tax identifiers and default tax structure.",
      },
      { name: "tax_number", label: "GST Number" },
      { name: "pan_number", label: "PAN Number" },
      { name: "cin_number", label: "CIN Number" },
      { name: "tax_name", label: "Tax Name" },
      {
        name: "tax_type",
        label: "Tax Type",
        type: "select",
        options: taxTypeOptions,
      },
      {
        name: "tax_percentage",
        label: "Tax Percentage",
        type: "number",
      },
      { name: "hsn_sac_code", label: "HSN/SAC Code" },
      { name: "tax_category", label: "Tax Category" },
      {
        name: "tax_inclusion",
        label: "Inclusive / Exclusive Tax",
        type: "select",
        options: taxInclusionOptions,
      },
      {
        name: "input_tax_credit",
        label: "Input Tax Credit",
        type: "boolean",
      },
      {
        name: "section_financial_settings",
        label: "Financial / Accounting Settings",
        type: "section",
        helper: "Controls accounting and financial configurations.",
      },
      {
        name: "fiscal_year_start_date",
        label: "Fiscal Year Start Date",
        type: "date",
      },
      {
        name: "fiscal_year_end_date",
        label: "Fiscal Year End Date",
        type: "date",
      },
      { name: "default_currency", label: "Default Currency" },
      {
        name: "exchange_rate_settings",
        label: "Exchange Rate Settings",
        type: "textarea",
      },
      {
        name: "chart_of_accounts",
        label: "Chart of Accounts",
        type: "textarea",
      },
      { name: "default_revenue_account", label: "Default Revenue Account" },
      { name: "default_expense_account", label: "Default Expense Account" },
      {
        name: "default_tax_rate",
        label: "Default Tax Rate",
        type: "number",
      },
      { name: "payment_terms", label: "Payment Terms" },
      {
        name: "credit_limit_settings",
        label: "Credit Limit Settings",
        type: "number",
      },
      {
        name: "rounding_method",
        label: "Rounding Method",
        type: "select",
        options: roundingMethodOptions,
      },
      {
        name: "section_inventory_settings",
        label: "Inventory Settings",
        type: "section",
        helper: "Controls product and stock behavior.",
      },
      {
        name: "enable_inventory_tracking",
        label: "Enable Inventory Tracking",
        type: "boolean",
      },
      { name: "warehouse_location", label: "Warehouse Location" },
      { name: "default_warehouse", label: "Default Warehouse" },
      { name: "reorder_level", label: "Reorder Level", type: "number" },
      { name: "reorder_quantity", label: "Reorder Quantity", type: "number" },
      {
        name: "stock_valuation_method",
        label: "Stock Valuation Method",
        type: "select",
        options: stockValuationOptions,
      },
      {
        name: "batch_number_tracking",
        label: "Batch Number Tracking",
        type: "boolean",
      },
      {
        name: "serial_number_tracking",
        label: "Serial Number Tracking",
        type: "boolean",
      },
      { name: "unit_of_measurement", label: "Unit of Measurement" },
      {
        name: "section_sales_settings",
        label: "Sales Settings",
        type: "section",
        helper: "Settings related to customer sales.",
      },
      { name: "default_price_list", label: "Default Price List" },
      {
        name: "discount_type",
        label: "Discount Type",
        type: "select",
        options: discountTypeOptions,
      },
      {
        name: "sales_commission",
        label: "Sales Commission",
        type: "number",
      },
      {
        name: "sales_approval_required",
        label: "Sales Approval Required",
        type: "boolean",
      },
      {
        name: "sales_return_policy",
        label: "Sales Return Policy",
        type: "textarea",
      },
      { name: "invoice_format", label: "Invoice Format" },
      { name: "delivery_terms", label: "Delivery Terms" },
      {
        name: "section_purchase_settings",
        label: "Purchase Settings",
        type: "section",
        helper: "Configuration for vendor purchasing.",
      },
      { name: "default_vendor", label: "Default Vendor" },
      {
        name: "purchase_approval_required",
        label: "Purchase Approval Required",
        type: "boolean",
      },
      { name: "purchase_order_prefix", label: "Purchase Order Prefix" },
      { name: "purchase_tax", label: "Purchase Tax", type: "number" },
      {
        name: "delivery_lead_time",
        label: "Delivery Lead Time",
        type: "number",
        helper: "Days",
      },
      { name: "purchase_payment_terms", label: "Payment Terms (Purchase)" },
      {
        name: "section_bank_details",
        label: "Bank Details",
        type: "section",
        helper: "Banking information used for payments and documents.",
      },
      { name: "bank_name", label: "Bank Name" },
      { name: "bank_account_name", label: "Account Holder Name" },
      { name: "bank_account_number", label: "Account Number" },
      {
        name: "bank_account_type",
        label: "Account Type",
        type: "select",
        options: ["savings", "current", "overdraft"],
      },
      { name: "bank_ifsc_code", label: "IFSC Code" },
      { name: "bank_swift_code", label: "SWIFT Code" },
      { name: "bank_branch_name", label: "Branch Name" },
      { name: "bank_branch_address", label: "Branch Address", type: "textarea" },
      { name: "upi_id", label: "UPI ID" },
      {
        name: "section_report_settings",
        label: "Report Settings",
        type: "section",
        helper: "Default formats and numbering for reports and documents.",
      },
      { name: "report_template", label: "Report Template" },
      { name: "report_footer", label: "Report Footer", type: "textarea" },
      {
        name: "report_export_format",
        label: "Export Format",
        type: "select",
        options: ["pdf", "excel", "csv"],
      },
      {
        name: "report_include_logo",
        label: "Include Company Logo",
        type: "boolean",
      },
      {
        name: "date_format",
        label: "Report Date Format",
        helper: "Example: YYYY-MM-DD",
      },
      { name: "invoice_prefix", label: "Invoice Prefix" },
      { name: "invoice_number_format", label: "Invoice Number Format" },
      { name: "quotation_prefix", label: "Quotation Prefix" },
      { name: "document_template", label: "Document Template" },
      {
        name: "auto_number_generation",
        label: "Auto Number Generation",
        type: "boolean",
      },
      {
        name: "invoice_start_number",
        label: "Invoice Start Number",
        type: "number",
      },
      {
        name: "section_notification_settings",
        label: "Notification Settings",
        type: "section",
        helper: "Controls alerts and communication.",
      },
      {
        name: "email_notifications",
        label: "Email Notifications",
        type: "boolean",
      },
      {
        name: "sms_notifications",
        label: "SMS Notifications",
        type: "boolean",
      },
      { name: "low_stock_alert", label: "Low Stock Alert", type: "boolean" },
      { name: "payment_reminder", label: "Payment Reminder", type: "boolean" },
      {
        name: "order_confirmation",
        label: "Order Confirmation",
        type: "boolean",
      },
      { name: "system_alerts", label: "System Alerts", type: "boolean" },
      {
        name: "section_user_role_settings",
        label: "User & Role Settings",
        type: "section",
        helper: "Controls access to ERP modules.",
      },
      { name: "user_name", label: "User Name" },
      { name: "user_email", label: "User Email", type: "email" },
      { name: "role_name", label: "Role Name" },
      {
        name: "access_level",
        label: "Access Level",
        type: "select",
        options: accessLevelOptions,
      },
      {
        name: "module_permissions",
        label: "Module Permissions",
        type: "textarea",
      },
      {
        name: "login_restrictions",
        label: "Login Restrictions",
        type: "textarea",
      },
      { name: "password_policy", label: "Password Policy", type: "textarea" },
    ],
  },
  "administration/roles": {
    endpoint: "/api/roles",
    formFields: [
      { name: "role_name", label: "Role Name", required: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  "administration/users": {
    endpoint: "/api/users",
    formFields: [
      { name: "company_id", label: "Company ID", required: true },
      { name: "role_id", label: "Role ID", required: true },
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone" },
      { name: "password", label: "Password", type: "password", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive", "suspended"],
        defaultValue: "active",
      },
    ],
  },
  "administration/activity-logs": {
    endpoint: "/api/activity-logs",
    createEndpoint: null,
    formFields: [],
  },
};

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  
  {
    name: "CRM",
    layout: "/admin",
    path: "crm",
    icon: <MdGroup className="h-6 w-6" />,
    component: <CrmModule />,
    children: [
      { name: "Customers", path: "crm/customers" },
      { name: "Leads", path: "crm/leads" },
      { name: "Lead Notes", path: "crm/lead-notes" },
    ],
  },
  {
    name: "Inventory",
    layout: "/admin",
    path: "inventory",
    icon: <MdInventory2 className="h-6 w-6" />,
    component: <InventoryModule />,
    children: [
      { name: "Categories", path: "inventory/categories" },
      { name: "Products", path: "inventory/products" },
      { name: "Warehouses", path: "inventory/warehouses" },
      { name: "Stock Movements", path: "inventory/stock-movements" },
    ],
  },
  {
    name: "Stock Movements",
    layout: "/admin",
    path: "inventory/stock-movements",
    component: (
      <SubModulePage
        title="Stock Movements"
        parent="Inventory"
        {...submoduleConfig["inventory/stock-movements"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Purchase",
    layout: "/admin",
    path: "purchase",
    icon: <MdLocalShipping className="h-6 w-6" />,
    component: <PurchaseModule />,
    children: [
      { name: "Suppliers", path: "purchase/suppliers" },
      { name: "Purchase Orders", path: "purchase/purchase-orders" },
    ],
  },
  {
    name: "Sales",
    layout: "/admin",
    path: "sales",
    icon: <MdShoppingCart className="h-6 w-6" />,
    component: <SalesModule />,
    children: [{ name: "Sales Orders", path: "sales/sales-orders" }],
  },
  {
    name: "Finance",
    layout: "/admin",
    path: "finance",
    icon: <MdAccountBalance className="h-6 w-6" />,
    component: <FinanceModule />,
    children: [
      { name: "Invoices", path: "finance/invoices" },
      { name: "Payments", path: "finance/payments" },
    ],
  },
  {
    name: "HR",
    layout: "/admin",
    path: "hr",
    icon: <MdBadge className="h-6 w-6" />,
    component: <HrModule />,
    children: [
      { name: "Departments", path: "hr/departments" },
      { name: "Employees", path: "hr/employees" },
      { name: "Attendance", path: "hr/attendance" },
      { name: "Leave Requests", path: "hr/leave-requests" },
    ],
  },
  {
    name: "Administration",
    layout: "/admin",
    path: "administration",
    icon: <MdBusiness className="h-6 w-6" />,
    component: <CoreModule />,
    children: [
      { name: "Business Settings", path: "administration/business-settings" },
      { name: "Companies", path: "administration/companies" },
      { name: "Roles", path: "administration/roles" },
      { name: "Users", path: "administration/users" },
      { name: "Activity Logs", path: "administration/activity-logs" },
    ],
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "crm/customers",
    component: (
      <SubModulePage
        title="Customers"
        parent="CRM"
        {...submoduleConfig["crm/customers"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Leads",
    layout: "/admin",
    path: "crm/leads",
    component: (
      <SubModulePage
        title="Leads"
        parent="CRM"
        {...submoduleConfig["crm/leads"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Lead Notes",
    layout: "/admin",
    path: "crm/lead-notes",
    component: (
      <SubModulePage
        title="Lead Notes"
        parent="CRM"
        {...submoduleConfig["crm/lead-notes"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "inventory/categories",
    component: (
      <SubModulePage
        title="Categories"
        parent="Inventory"
        {...submoduleConfig["inventory/categories"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "inventory/products",
    component: (
      <SubModulePage
        title="Products"
        parent="Inventory"
        {...submoduleConfig["inventory/products"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Warehouses",
    layout: "/admin",
    path: "inventory/warehouses",
    component: (
      <SubModulePage
        title="Warehouses"
        parent="Inventory"
        {...submoduleConfig["inventory/warehouses"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Suppliers",
    layout: "/admin",
    path: "purchase/suppliers",
    component: (
      <SubModulePage
        title="Suppliers"
        parent="Purchase"
        {...submoduleConfig["purchase/suppliers"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Purchase Orders",
    layout: "/admin",
    path: "purchase/purchase-orders",
    component: (
      <SubModulePage
        title="Purchase Orders"
        parent="Purchase"
        {...submoduleConfig["purchase/purchase-orders"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Sales Orders",
    layout: "/admin",
    path: "sales/sales-orders",
    component: (
      <SubModulePage
        title="Sales Orders"
        parent="Sales"
        {...submoduleConfig["sales/sales-orders"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Invoices",
    layout: "/admin",
    path: "finance/invoices",
    component: (
      <SubModulePage
        title="Invoices"
        parent="Finance"
        {...submoduleConfig["finance/invoices"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Payments",
    layout: "/admin",
    path: "finance/payments",
    component: (
      <SubModulePage
        title="Payments"
        parent="Finance"
        {...submoduleConfig["finance/payments"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Departments",
    layout: "/admin",
    path: "hr/departments",
    component: (
      <SubModulePage
        title="Departments"
        parent="HR"
        {...submoduleConfig["hr/departments"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Employees",
    layout: "/admin",
    path: "hr/employees",
    component: (
      <SubModulePage
        title="Employees"
        parent="HR"
        {...submoduleConfig["hr/employees"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Attendance",
    layout: "/admin",
    path: "hr/attendance",
    component: (
      <SubModulePage
        title="Attendance"
        parent="HR"
        {...submoduleConfig["hr/attendance"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Leave Requests",
    layout: "/admin",
    path: "hr/leave-requests",
    component: (
      <SubModulePage
        title="Leave Requests"
        parent="HR"
        {...submoduleConfig["hr/leave-requests"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Companies",
    layout: "/admin",
    path: "administration/companies",
    component: (
      <SubModulePage
        title="Companies"
        parent="Administration"
        {...submoduleConfig["administration/companies"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Business Settings",
    layout: "/admin",
    path: "administration/business-settings",
    component: (
      <SubModulePage
        title="Business Settings"
        parent="Administration"
        {...submoduleConfig["administration/business-settings"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Roles",
    layout: "/admin",
    path: "administration/roles",
    component: (
      <SubModulePage
        title="Roles"
        parent="Administration"
        {...submoduleConfig["administration/roles"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "administration/users",
    component: (
      <SubModulePage
        title="Users"
        parent="Administration"
        {...submoduleConfig["administration/users"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "Activity Logs",
    layout: "/admin",
    path: "administration/activity-logs",
    component: (
      <SubModulePage
        title="Activity Logs"
        parent="Administration"
        {...submoduleConfig["administration/activity-logs"]}
      />
    ),
    hideInSidebar: true,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
    hideInSidebar: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    hideInSidebar: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    hideInSidebar: true,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    hideInSidebar: true,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdPerson className="h-6 w-6" />,
    component: <SignUp />,
    hideInSidebar: true,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
    hideInSidebar: true,
  },
];
export default routes;
