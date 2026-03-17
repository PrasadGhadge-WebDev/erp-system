import ModuleLanding from "views/admin/submodules/ModuleLanding";

const CoreModule = () => {
  return (
    <ModuleLanding
      title="Administration"
      description="Set up business settings, manage access, and audit activity."
      items={[
        {
          name: "Business Settings",
          description: "Update company identity, currency, and tax settings.",
          to: "/admin/administration/business-settings",
        },
        {
          name: "Companies",
          description: "Manage legal entities and company profiles.",
          to: "/admin/administration/companies",
        },
        {
          name: "Roles",
          description: "Create roles and define responsibilities.",
          to: "/admin/administration/roles",
        },
        {
          name: "Users",
          description: "Invite users and assign roles.",
          to: "/admin/administration/users",
        },
        {
          name: "Activity Logs",
          description: "Review recent system actions and audits.",
          to: "/admin/administration/activity-logs",
        },
      ]}
    />
  );
};

export default CoreModule;
