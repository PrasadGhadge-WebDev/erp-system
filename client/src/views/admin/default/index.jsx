import { useEffect, useMemo, useState } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import {
  MdAccountBalance,
  MdBarChart,
  MdGroup,
  MdInventory2,
  MdLocalShipping,
  MdShoppingCart,
} from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { apiFetch } from "api/client";
import Card from "components/card";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    let active = true;
    const loadSummary = async () => {
      setLoadingSummary(true);
      setSummaryError("");
      try {
        const data = await apiFetch("/api/summary");
        if (!active) return;
        setSummary(data);
      } catch (err) {
        if (!active) return;
        setSummaryError(err?.message || "Failed to load summary");
      } finally {
        if (active) setLoadingSummary(false);
      }
    };

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  const counts = summary?.counts || {};
  const totals = summary?.totals || {};
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    []
  );
  const formatCount = (value) =>
    loadingSummary ? "..." : (value || 0).toLocaleString();
  const formatCurrency = (value) =>
    loadingSummary ? "..." : currencyFormatter.format(value || 0);

  return (
    <div>
      {summaryError ? (
        <Card extra="mb-5 p-4">
          <p className="text-sm text-red-500">
            {summaryError.includes("Not authorized")
              ? "Please sign in to view live metrics."
              : summaryError}
          </p>
        </Card>
      ) : null}
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdGroup className="h-7 w-7" />}
          title={"Customers"}
          subtitle={formatCount(counts.customers)}
        />
        <Widget
          icon={<MdInventory2 className="h-6 w-6" />}
          title={"Products"}
          subtitle={formatCount(counts.products)}
        />
        <Widget
          icon={<MdShoppingCart className="h-7 w-7" />}
          title={"Sales Orders"}
          subtitle={formatCount(counts.sales_orders)}
        />
        <Widget
          icon={<MdLocalShipping className="h-6 w-6" />}
          title={"Purchase Orders"}
          subtitle={formatCount(counts.purchase_orders)}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales Revenue"}
          subtitle={formatCurrency(totals.sales)}
        />
        <Widget
          icon={<MdAccountBalance className="h-6 w-6" />}
          title={"Payments Received"}
          subtitle={formatCurrency(totals.payments)}
        />
      </div>

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
