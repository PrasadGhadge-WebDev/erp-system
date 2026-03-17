import ModuleLanding from "views/admin/submodules/ModuleLanding";

const CrmModule = () => {
  return (
    <ModuleLanding
      items={[
        {
          name: "Customers",
          description: "Maintain your customer directory and contact details.",
          to: "/admin/crm/customers",
        },
        {
          name: "Leads",
          description: "Capture new leads and track their current status.",
          to: "/admin/crm/leads",
        },
        {
          name: "Lead Notes",
          description: "Add follow-up notes and keep the timeline clear.",
          to: "/admin/crm/lead-notes",
        },
      ]}
    />
  );
};

export default CrmModule;
