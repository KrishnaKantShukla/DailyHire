const express = require('express');
const { Helper, isConnected, memoryStore } = require('../db');

const router = express.Router();

// ─── GET /api/helpers ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search, available, minRating, maxPrice } = req.query;

    if (isConnected()) {
      let query = {};
      if (category && category !== 'all') {
        query.profession = new RegExp(`^${category}$`, 'i');
      }

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { profession: new RegExp(search, 'i') },
          { bio: new RegExp(search, 'i') },
          { skills: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      if (available === 'true') query.available = true;
      if (minRating) query.rating = { $gte: Number(minRating) };
      if (maxPrice) query.hourlyRate = { $lte: Number(maxPrice) };

      const helpersList = await Helper.find(query).sort({ rating: -1, completedJobs: -1 });

      const formattedHelpers = helpersList.map((h) => ({
        id: h.customId || h._id.toString(),
        _id: h._id.toString(),
        name: h.name,
        profession: h.profession,
        image: h.image,
        rating: h.rating,
        reviewCount: h.reviewCount,
        distance: h.distance,
        priceRange: h.priceRange,
        hourlyRate: h.hourlyRate,
        available: h.available,
        verified: h.verified,
        bio: h.bio,
        skills: h.skills,
        completedJobs: h.completedJobs,
        location: h.location,
      }));

      return res.json(formattedHelpers);
    }

    // Memory store fallback filtering
    let results = [...memoryStore.helpers];
    if (category && category !== 'all') {
      results = results.filter((h) => h.profession.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.profession.toLowerCase().includes(q) ||
          h.bio.toLowerCase().includes(q)
      );
    }
    if (available === 'true') {
      results = results.filter((h) => h.available);
    }
    if (minRating) {
      results = results.filter((h) => h.rating >= Number(minRating));
    }
    if (maxPrice) {
      results = results.filter((h) => h.hourlyRate <= Number(maxPrice));
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching helpers:', error.message);
    res.json(memoryStore.helpers);
  }
});

// ─── GET /api/helpers/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      let helper = await Helper.findOne({ customId: id });
      if (!helper && id.match(/^[0-9a-fA-F]{24}$/)) {
        helper = await Helper.findById(id);
      }

      if (helper) {
        return res.json({
          id: helper.customId || helper._id.toString(),
          _id: helper._id.toString(),
          name: helper.name,
          profession: helper.profession,
          image: helper.image,
          rating: helper.rating,
          reviewCount: helper.reviewCount,
          distance: helper.distance,
          priceRange: helper.priceRange,
          hourlyRate: helper.hourlyRate,
          available: helper.available,
          verified: helper.verified,
          bio: helper.bio,
          skills: helper.skills,
          completedJobs: helper.completedJobs,
          location: helper.location,
        });
      }
    }

    // Memory store fallback lookup
    const helper = memoryStore.helpers.find((h) => h.customId === id || h.id === id || h._id === id);
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found.' });
    }
    res.json(helper);
  } catch (error) {
    console.error('Error fetching helper detail:', error.message);
    res.status(500).json({ message: 'Failed to fetch helper details.' });
  }
});

module.exports = router;
