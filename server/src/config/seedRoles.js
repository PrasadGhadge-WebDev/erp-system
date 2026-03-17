const Role = require('../models/core/Role');

const seedRoles = async () => {
  const roles = [
    { role_name: 'superadmin', description: 'Super admin role' },
    { role_name: 'admin', description: 'Admin role' },
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ role_name: role.role_name });
    if (!exists) {
      await Role.create(role);
    }
  }
};

module.exports = seedRoles;
