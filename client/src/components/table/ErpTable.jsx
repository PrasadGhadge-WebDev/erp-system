import React from "react";
import Card from "components/card";

const ErpTable = ({
  title,
  columns,
  data,
  isLoading,
  error,
  emptyMessage = "No data available.",
  maxRows,
}) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const rows = hasData && maxRows ? data.slice(0, maxRows) : data;

  return (
    <Card extra="w-full p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          {title}
        </h2>
      </header>

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      ) : error ? (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      ) : !hasData ? (
        <p className="mt-4 text-sm text-gray-600">{emptyMessage}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className="pb-2 pr-4 text-left text-xs font-bold text-gray-600"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row._id || rowIndex} className="border-b border-gray-100">
                  {columns.map((column) => (
                    <td
                      key={`${row._id || rowIndex}-${column.accessor}`}
                      className="py-3 pr-4 text-sm text-navy-700 dark:text-white"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ErpTable;
