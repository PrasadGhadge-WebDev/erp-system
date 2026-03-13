const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
  res.send('ERP Backend API is running...');
});

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const userRoutes = require('./src/routes/userRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const leadRoutes = require('./src/routes/leadRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const salesRoutes = require('./src/routes/salesRoutes');
const financeRoutes = require('./src/routes/financeRoutes');
const hrRoutes = require('./src/routes/hrRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const activityLogRoutes = require('./src/routes/activityLogRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error Handling Middleware
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
