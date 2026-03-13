import React from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import {
  getCompanies,
  getCustomers,
  getEmployees,
  getLeads,
  getProducts,
  getUsers,
} from "api/erp";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    companies: 0,
    users: 0,
    customers: 0,
    leads: 0,
    products: 0,
    employees: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.allSettled([
          getCompanies(),
          getUsers(),
          getCustomers(),
          getLeads(),
          getProducts(),
          getEmployees(),
        ]);

        const getCount = (result) =>
          result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value.length
            : 0;

        const [
          companiesResult,
          usersResult,
          customersResult,
          leadsResult,
          productsResult,
          employeesResult,
        ] = results;

        if (!isMounted) return;

        setStats({
          companies: getCount(companiesResult),
          users: getCount(usersResult),
          customers: getCount(customersResult),
          leads: getCount(leadsResult),
          products: getCount(productsResult),
          employees: getCount(employeesResult),
        });

        const failures = results.filter((result) => result.status === "rejected");
        if (failures.length > 0) {
          setError("Some dashboard stats could not be loaded.");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load dashboard stats.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Companies"}
          subtitle={loading ? "..." : stats.companies}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Users"}
          subtitle={loading ? "..." : stats.users}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Customers"}
          subtitle={loading ? "..." : stats.customers}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Leads"}
          subtitle={loading ? "..." : stats.leads}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Products"}
          subtitle={loading ? "..." : stats.products}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Employees"}
          subtitle={loading ? "..." : stats.employees}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
