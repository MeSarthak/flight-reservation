const service = require('../services/admin.analytics.service');

exports.monthlyRevenue = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const result = await service.getMonthlyRevenue({ year });
    res.json({ status: true, year, revenue: result });
  } catch (err) {
    console.error('admin.analytics.monthlyRevenue error', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
