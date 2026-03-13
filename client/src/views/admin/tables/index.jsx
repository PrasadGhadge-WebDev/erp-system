import React from "react";
import ErpTable from "components/table/ErpTable";
import {
  getActivityLogs,
  getAttendance,
  getCategories,
  getCompanies,
  getCustomers,
  getDepartments,
  getEmployees,
  getInvoices,
  getLeads,
  getLeaveRequests,
  getPayments,
  getProducts,
  getPurchaseItems,
  getPurchaseOrders,
  getRoles,
  getSalesOrders,
  getSalesItems,
  getStockMovements,
  getUsers,
  getWarehouses,
  getSuppliers,
} from "api/erp";

const Tables = () => {
  const [data, setData] = React.useState({
    roles: [],
    companies: [],
    users: [],
    activityLogs: [],
    customers: [],
    leads: [],
    categories: [],
    products: [],
    warehouses: [],
    stockMovements: [],
    suppliers: [],
    purchaseOrders: [],
    purchaseItems: [],
    salesOrders: [],
    salesItems: [],
    invoices: [],
    payments: [],
    departments: [],
    employees: [],
    attendance: [],
    leaveRequests: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.allSettled([
          getRoles(),
          getCompanies(),
          getUsers(),
          getActivityLogs(),
          getCustomers(),
          getLeads(),
          getCategories(),
          getProducts(),
          getWarehouses(),
          getStockMovements(),
          getSuppliers(),
          getPurchaseOrders(),
          getPurchaseItems(),
          getSalesOrders(),
          getSalesItems(),
          getInvoices(),
          getPayments(),
          getDepartments(),
          getEmployees(),
          getAttendance(),
          getLeaveRequests(),
        ]);

        const extract = (result) =>
          result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

        if (!isMounted) return;

        const [
          rolesResult,
          companiesResult,
          usersResult,
          activityLogsResult,
          customersResult,
          leadsResult,
          categoriesResult,
          productsResult,
          warehousesResult,
          stockMovementsResult,
          suppliersResult,
          purchaseOrdersResult,
          purchaseItemsResult,
          salesOrdersResult,
          salesItemsResult,
          invoicesResult,
          paymentsResult,
          departmentsResult,
          employeesResult,
          attendanceResult,
          leaveRequestsResult,
        ] = results;

        setData({
          roles: extract(rolesResult),
          companies: extract(companiesResult),
          users: extract(usersResult),
          activityLogs: extract(activityLogsResult),
          customers: extract(customersResult),
          leads: extract(leadsResult),
          categories: extract(categoriesResult),
          products: extract(productsResult),
          warehouses: extract(warehousesResult),
          stockMovements: extract(stockMovementsResult),
          suppliers: extract(suppliersResult),
          purchaseOrders: extract(purchaseOrdersResult),
          purchaseItems: extract(purchaseItemsResult),
          salesOrders: extract(salesOrdersResult),
          salesItems: extract(salesItemsResult),
          invoices: extract(invoicesResult),
          payments: extract(paymentsResult),
          departments: extract(departmentsResult),
          employees: extract(employeesResult),
          attendance: extract(attendanceResult),
          leaveRequests: extract(leaveRequestsResult),
        });

        const failures = results.filter((result) => result.status === "rejected");
        if (failures.length > 0) {
          setError("Some tables could not be loaded due to permissions.");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load ERP data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const roleColumns = [
    { header: "Role", accessor: "role_name" },
    { header: "Description", accessor: "description" },
  ];

  const companyColumns = [
    { header: "Company", accessor: "company_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Status", accessor: "status" },
  ];

  const userColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (row) => row.role_id?.role_name || row.role || "-",
    },
    {
      header: "Company",
      accessor: "company",
      render: (row) => row.company_id?.company_name || row.company || "-",
    },
  ];

  const customerColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Type", accessor: "customer_type" },
  ];

  const leadColumns = [
    { header: "Name", accessor: "name" },
    { header: "Source", accessor: "source" },
    { header: "Status", accessor: "status" },
    {
      header: "Assigned",
      accessor: "assigned_to",
      render: (row) => row.assigned_to?.name || "-",
    },
  ];

  const categoryColumns = [
    { header: "Category", accessor: "name" },
    { header: "Description", accessor: "description" },
  ];

  const productColumns = [
    { header: "Product", accessor: "product_name" },
    { header: "SKU", accessor: "sku" },
    { header: "Price", accessor: "selling_price" },
    { header: "Stock", accessor: "stock_quantity" },
  ];

  const warehouseColumns = [
    { header: "Warehouse", accessor: "warehouse_name" },
    { header: "Location", accessor: "location" },
    { header: "Manager", accessor: "manager_name" },
    { header: "Contact", accessor: "contact_number" },
  ];

  const stockMovementColumns = [
    {
      header: "Product",
      accessor: "product_id",
      render: (row) => row.product_id?.product_name || "-",
    },
    {
      header: "Warehouse",
      accessor: "warehouse_id",
      render: (row) => row.warehouse_id?.warehouse_name || "-",
    },
    { header: "Type", accessor: "movement_type" },
    { header: "Qty", accessor: "quantity" },
    {
      header: "Date",
      accessor: "created_at",
      render: (row) => formatDate(row.created_at || row.createdAt),
    },
  ];

  const supplierColumns = [
    { header: "Supplier", accessor: "company_name" },
    { header: "Contact", accessor: "contact_person" },
    { header: "Phone", accessor: "phone" },
    { header: "Country", accessor: "country" },
  ];

  const purchaseOrderColumns = [
    { header: "Order", accessor: "order_number" },
    {
      header: "Supplier",
      accessor: "supplier_id",
      render: (row) => row.supplier_id?.company_name || "-",
    },
    { header: "Total", accessor: "total_amount" },
    { header: "Status", accessor: "status" },
  ];

  const purchaseItemColumns = [
    {
      header: "Order",
      accessor: "purchase_order_id",
      render: (row) => row.purchase_order_id?.order_number || "-",
    },
    {
      header: "Product",
      accessor: "product_id",
      render: (row) => row.product_id?.product_name || "-",
    },
    { header: "Qty", accessor: "quantity" },
    { header: "Total", accessor: "total_price" },
  ];

  const salesColumns = [
    { header: "Order", accessor: "order_number" },
    {
      header: "Customer",
      accessor: "customer_id",
      render: (row) => row.customer_id?.name || "-",
    },
    { header: "Total", accessor: "total_amount" },
    { header: "Status", accessor: "status" },
  ];

  const salesItemColumns = [
    {
      header: "Order",
      accessor: "sales_order_id",
      render: (row) => row.sales_order_id?.order_number || "-",
    },
    {
      header: "Product",
      accessor: "product_id",
      render: (row) => row.product_id?.product_name || "-",
    },
    { header: "Qty", accessor: "quantity" },
    { header: "Total", accessor: "total_price" },
  ];

  const invoiceColumns = [
    { header: "Invoice", accessor: "invoice_number" },
    {
      header: "Order",
      accessor: "sales_order_id",
      render: (row) => row.sales_order_id?.order_number || "-",
    },
    { header: "Total", accessor: "total_amount" },
    { header: "Status", accessor: "status" },
  ];

  const paymentColumns = [
    {
      header: "Invoice",
      accessor: "invoice_id",
      render: (row) => row.invoice_id?.invoice_number || "-",
    },
    { header: "Method", accessor: "payment_method" },
    { header: "Amount", accessor: "amount" },
    {
      header: "Date",
      accessor: "payment_date",
      render: (row) => formatDate(row.payment_date),
    },
  ];

  const departmentColumns = [
    { header: "Department", accessor: "department_name" },
    { header: "Description", accessor: "description" },
  ];

  const employeeColumns = [
    { header: "Name", accessor: "name" },
    { header: "Code", accessor: "employee_code" },
    {
      header: "Department",
      accessor: "department_id",
      render: (row) => row.department_id?.department_name || "-",
    },
    { header: "Position", accessor: "position" },
  ];

  const attendanceColumns = [
    {
      header: "Employee",
      accessor: "employee_id",
      render: (row) => row.employee_id?.name || "-",
    },
    {
      header: "Date",
      accessor: "attendance_date",
      render: (row) => formatDate(row.attendance_date),
    },
    { header: "Status", accessor: "status" },
    {
      header: "Check In",
      accessor: "check_in_time",
      render: (row) => formatDate(row.check_in_time),
    },
  ];

  const leaveRequestColumns = [
    {
      header: "Employee",
      accessor: "employee_id",
      render: (row) => row.employee_id?.name || "-",
    },
    { header: "Type", accessor: "leave_type" },
    {
      header: "Start",
      accessor: "start_date",
      render: (row) => formatDate(row.start_date),
    },
    {
      header: "End",
      accessor: "end_date",
      render: (row) => formatDate(row.end_date),
    },
    { header: "Status", accessor: "status" },
  ];

  const activityLogColumns = [
    {
      header: "User",
      accessor: "user_id",
      render: (row) => row.user_id?.name || "-",
    },
    { header: "Module", accessor: "module_name" },
    { header: "Action", accessor: "action" },
    {
      header: "Date",
      accessor: "created_at",
      render: (row) => formatDate(row.created_at || row.createdAt),
    },
  ];

  return (
    <div>
      {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}
      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          Core Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Roles"
            columns={roleColumns}
            data={data.roles}
            isLoading={loading}
            emptyMessage="No roles or no access."
            maxRows={8}
          />
          <ErpTable
            title="Companies"
            columns={companyColumns}
            data={data.companies}
            isLoading={loading}
            emptyMessage="No companies or no access."
            maxRows={8}
          />
          <ErpTable
            title="Users"
            columns={userColumns}
            data={data.users}
            isLoading={loading}
            emptyMessage="No users or no access."
            maxRows={8}
          />
          <ErpTable
            title="Activity Logs"
            columns={activityLogColumns}
            data={data.activityLogs}
            isLoading={loading}
            emptyMessage="No activity logs or no access."
            maxRows={8}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          CRM Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Customers"
            columns={customerColumns}
            data={data.customers}
            isLoading={loading}
            emptyMessage="No customers found."
            maxRows={8}
          />
          <ErpTable
            title="Leads"
            columns={leadColumns}
            data={data.leads}
            isLoading={loading}
            emptyMessage="No leads found."
            maxRows={8}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          Inventory Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Categories"
            columns={categoryColumns}
            data={data.categories}
            isLoading={loading}
            emptyMessage="No categories found."
            maxRows={8}
          />
          <ErpTable
            title="Products"
            columns={productColumns}
            data={data.products}
            isLoading={loading}
            emptyMessage="No products found."
            maxRows={8}
          />
          <ErpTable
            title="Warehouses"
            columns={warehouseColumns}
            data={data.warehouses}
            isLoading={loading}
            emptyMessage="No warehouses found."
            maxRows={8}
          />
          <ErpTable
            title="Stock Movements"
            columns={stockMovementColumns}
            data={data.stockMovements}
            isLoading={loading}
            emptyMessage="No stock movements found."
            maxRows={8}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          Purchase Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Suppliers"
            columns={supplierColumns}
            data={data.suppliers}
            isLoading={loading}
            emptyMessage="No suppliers found."
            maxRows={8}
          />
          <ErpTable
            title="Purchase Orders"
            columns={purchaseOrderColumns}
            data={data.purchaseOrders}
            isLoading={loading}
            emptyMessage="No purchase orders found."
            maxRows={8}
          />
          <ErpTable
            title="Purchase Items"
            columns={purchaseItemColumns}
            data={data.purchaseItems}
            isLoading={loading}
            emptyMessage="No purchase items found."
            maxRows={8}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          Sales Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Sales Orders"
            columns={salesColumns}
            data={data.salesOrders}
            isLoading={loading}
            emptyMessage="No sales orders found."
            maxRows={8}
          />
          <ErpTable
            title="Sales Items"
            columns={salesItemColumns}
            data={data.salesItems}
            isLoading={loading}
            emptyMessage="No sales items found."
            maxRows={8}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          Finance Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Invoices"
            columns={invoiceColumns}
            data={data.invoices}
            isLoading={loading}
            emptyMessage="No invoices found."
            maxRows={8}
          />
          <ErpTable
            title="Payments"
            columns={paymentColumns}
            data={data.payments}
            isLoading={loading}
            emptyMessage="No payments found."
            maxRows={8}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          HR Module
        </h3>
        <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
          <ErpTable
            title="Departments"
            columns={departmentColumns}
            data={data.departments}
            isLoading={loading}
            emptyMessage="No departments found."
            maxRows={8}
          />
          <ErpTable
            title="Employees"
            columns={employeeColumns}
            data={data.employees}
            isLoading={loading}
            emptyMessage="No employees found."
            maxRows={8}
          />
          <ErpTable
            title="Attendance"
            columns={attendanceColumns}
            data={data.attendance}
            isLoading={loading}
            emptyMessage="No attendance records found."
            maxRows={8}
          />
          <ErpTable
            title="Leave Requests"
            columns={leaveRequestColumns}
            data={data.leaveRequests}
            isLoading={loading}
            emptyMessage="No leave requests found."
            maxRows={8}
          />
        </div>
      </div>
    </div>
  );
};

export default Tables;
