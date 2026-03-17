const mongoose = require('mongoose');
const User = require('./src/models/core/User');
const Role = require('./src/models/core/Role');
const Company = require('./src/models/core/Company');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    let company = await Company.findOne({ email: 'test@inc.com' });
    if (!company) {
      company = await Company.create({
        company_name: 'Test Inc',
        email: 'test@inc.com',
        status: 'active'
      });
    }

    let role = await Role.findOne({ role_name: 'admin' });
    if (!role) {
      role = await Role.create({
        role_name: 'admin',
        description: 'Admin'
      });
    }

    let user = await User.findOne({ email: 'admin@test.com' });
    if (!user) {
      user = await User.create({
        company_id: company._id,
        role_id: role._id,
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        status: 'active'
      });
    }

    console.log('Admin user created successfully');
    console.log('Email: admin@test.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
