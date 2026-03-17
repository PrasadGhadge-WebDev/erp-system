import ModuleLanding from "views/admin/submodules/ModuleLanding";

const FinanceModule = () => {
  return (
    <ModuleLanding
      title="Finance"
      description="Track invoices, payments, and overall cash flow."
      items={[
        {
          name: "Invoices",
          description: "Create invoices and monitor payment status.",
          to: "/admin/finance/invoices",
        },
        {
          name: "Payments",
          description: "Record payments and reconcile transactions.",
          to: "/admin/finance/payments",
        },
      ]}
    />
  );
};

export default FinanceModule;
