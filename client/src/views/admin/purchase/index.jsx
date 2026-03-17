import ModuleLanding from "views/admin/submodules/ModuleLanding";

const PurchaseModule = () => {
  return (
    <ModuleLanding
      title="Purchase"
      description="Handle supplier records and track purchase orders."
      items={[
        {
          name: "Suppliers",
          description: "Manage supplier contacts and compliance details.",
          to: "/admin/purchase/suppliers",
        },
        {
          name: "Purchase Orders",
          description: "Create and track incoming purchase orders.",
          to: "/admin/purchase/purchase-orders",
        },
      ]}
    />
  );
};

export default PurchaseModule;
