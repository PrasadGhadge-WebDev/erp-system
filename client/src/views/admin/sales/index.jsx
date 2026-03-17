import ModuleLanding from "views/admin/submodules/ModuleLanding";

const SalesModule = () => {
  return (
    <ModuleLanding
      title="Sales"
      description="Create sales orders, manage discounts, and track fulfillment."
      items={[
        {
          name: "Sales Orders",
          description: "Log sales orders and capture order details.",
          to: "/admin/sales/sales-orders",
        },
      ]}
    />
  );
};

export default SalesModule;
