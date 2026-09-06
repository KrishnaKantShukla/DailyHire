const express = require('express');
const { Service, isConnected, memoryStore } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (isConnected()) {
      const servicesList = await Service.find().sort({ basePrice: 1 });
      const formattedServices = servicesList.map((s) => ({
        id: s.customId || s._id.toString(),
        _id: s._id.toString(),
        name: s.name,
        description: s.description,
        basePrice: s.basePrice,
        duration: s.duration,
      }));
      return res.json(formattedServices);
    }

    // Memory Store Fallback
    res.json(memoryStore.services);
  } catch (error) {
    console.error('Error fetching services, serving memory fallback:', error.message);
    res.json(memoryStore.services);
  }
});

module.exports = router;
