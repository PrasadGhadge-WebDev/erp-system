import ModuleLanding from "views/admin/submodules/ModuleLanding";

const HrModule = () => {
  return (
    <ModuleLanding
      title="HR"
      description="Manage departments, employees, attendance, and leave."
      items={[
        {
          name: "Departments",
          description: "Organize teams and reporting structures.",
          to: "/admin/hr/departments",
        },
        {
          name: "Employees",
          description: "Maintain employee records and job details.",
          to: "/admin/hr/employees",
        },
        {
          name: "Attendance",
          description: "Track daily attendance and working hours.",
          to: "/admin/hr/attendance",
        },
        {
          name: "Leave Requests",
          description: "Review and approve employee leave requests.",
          to: "/admin/hr/leave-requests",
        },
      ]}
    />
  );
};

export default HrModule;
