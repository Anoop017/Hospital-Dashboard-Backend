import Patient from '../models/Patient.js';
import moment from 'moment';

export const getPatientsPerWeek = async (req, res) => {
  try {
    // Get current week number
    const now = moment();
    const results = [];

    for (let i = 5; i >= 0; i--) {
      const weekStart = moment(now).subtract(i, 'weeks').startOf('week');
      const weekEnd = moment(now).subtract(i, 'weeks').endOf('week');
      const weekLabel = `Week ${weekStart.isoWeek()}`;

      const count = await Patient.countDocuments({
        createdAt: {
          $gte: weekStart.toDate(),
          $lte: weekEnd.toDate()
        }
      });
      results.push({ week: weekLabel, count });
    }

    res.json(results);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
