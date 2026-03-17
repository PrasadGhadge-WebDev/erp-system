import ModuleLanding from "views/admin/submodules/ModuleLanding";

const InventoryModule = () => {
  return (
    <ModuleLanding
      title="Inventory"
      description="Manage stock, storage locations, and movement history."
      items={[
        {
          name: "Categories",
          description: "Organize products into clear inventory categories.",
          to: "/admin/inventory/categories",
        },
        {
          name: "Products",
          description: "Track SKUs, pricing, and available stock.",
          to: "/admin/inventory/products",
        },
        {
          name: "Warehouses",
          description: "Maintain warehouse locations and managers.",
          to: "/admin/inventory/warehouses",
        },
        {
          name: "Stock Movements",
          description: "Record inbound, outbound, and transfer movements.",
          to: "/admin/inventory/stock-movements",
        },
      ]}
    />
  );
};

export default InventoryModule;
