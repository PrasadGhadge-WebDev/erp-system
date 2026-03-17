const BusinessSetting = require('../models/core/BusinessSetting');

// @desc    Get business settings for the current company
// @route   GET /api/business-settings
// @access  Private/Admin
const getBusinessSettings = async (req, res, next) => {
  try {
    const settings = await BusinessSetting.find({
      company_id: req.user.company_id,
    }).populate('company_id', 'company_name');
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update business settings for the current company
// @route   POST /api/business-settings
// @access  Private/Admin
const upsertBusinessSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      'business_name',
      'legal_name',
      'company_logo',
      'business_type',
      'industry_type',
      'registration_number',
      'email',
      'phone',
      'contact_person',
      'alternate_phone',
      'support_email',
      'support_phone',
      'address',
      'city',
      'state',
      'country',
      'postal_code',
      'website',
      'tax_number',
      'pan_number',
      'cin_number',
      'currency',
      'timezone',
      'date_format',
      'fiscal_year_start_date',
      'fiscal_year_end_date',
      'default_currency',
      'exchange_rate_settings',
      'chart_of_accounts',
      'default_revenue_account',
      'default_expense_account',
      'default_tax_rate',
      'payment_terms',
      'credit_limit_settings',
      'rounding_method',
      'tax_name',
      'tax_type',
      'tax_percentage',
      'hsn_sac_code',
      'tax_category',
      'tax_inclusion',
      'input_tax_credit',
      'enable_inventory_tracking',
      'warehouse_location',
      'default_warehouse',
      'reorder_level',
      'reorder_quantity',
      'stock_valuation_method',
      'batch_number_tracking',
      'serial_number_tracking',
      'unit_of_measurement',
      'default_price_list',
      'discount_type',
      'sales_commission',
      'sales_approval_required',
      'sales_return_policy',
      'invoice_format',
      'delivery_terms',
      'default_vendor',
      'purchase_approval_required',
      'purchase_order_prefix',
      'purchase_tax',
      'delivery_lead_time',
      'purchase_payment_terms',
      'bank_name',
      'bank_account_name',
      'bank_account_number',
      'bank_account_type',
      'bank_ifsc_code',
      'bank_swift_code',
      'bank_branch_name',
      'bank_branch_address',
      'upi_id',
      'report_template',
      'report_footer',
      'report_export_format',
      'report_include_logo',
      'user_name',
      'user_email',
      'role_name',
      'access_level',
      'module_permissions',
      'login_restrictions',
      'password_policy',
      'email_notifications',
      'sms_notifications',
      'low_stock_alert',
      'payment_reminder',
      'order_confirmation',
      'system_alerts',
      'invoice_prefix',
      'invoice_number_format',
      'quotation_prefix',
      'document_template',
      'auto_number_generation',
      'invoice_start_number',
    ];

    const payload = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        payload[field] = req.body[field];
      }
    });

    const existing = await BusinessSetting.findOne({
      company_id: req.user.company_id,
    });

    if (existing) {
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) {
          existing[key] = value;
        }
      });
      const updated = await existing.save();
      return res.json(updated);
    }

    const created = await BusinessSetting.create({
      company_id: req.user.company_id,
      ...payload,
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessSettings,
  upsertBusinessSettings,
};
