const express = require('express');
const { Review, Helper, isConnected, memoryStore } = require('../db');

const router = express.Router();

// ─── GET /api/reviews/:helperId ─────────────────────────────────────────────
router.get('/:helperId', async (req, res) => {
  try {
    const { helperId } = req.params;

    if (isConnected()) {
      const reviewsList = await Review.find({ helperId }).sort({ createdAt: -1 });

      const formatted = reviewsList.map((r) => ({
        id: r._id.toString(),
        helperId: r.helperId,
        userName: r.userName,
        userImage: r.userImage,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
      }));

      return res.json(formatted);
    }

    // Memory Store Fallback
    const list = memoryStore.reviews.filter((r) => r.helperId === helperId);
    res.json(list);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.json(memoryStore.reviews.filter((r) => r.helperId === req.params.helperId));
  }
});

// ─── POST /api/reviews ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { helperId, userName, userImage, rating, comment } = req.body;

    if (!helperId || !userName || !rating || !comment) {
      return res.status(400).json({ message: 'Helper ID, user name, rating, and comment are required.' });
    }

    if (isConnected()) {
      const newReview = await Review.create({
        helperId,
        userName,
        userImage: userImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        rating: Number(rating),
        comment,
        date: 'Just now',
      });

      const allReviews = await Review.find({ helperId });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      const helperOrConditions = [{ customId: helperId }];
      if (typeof helperId === 'string' && helperId.match(/^[0-9a-fA-F]{24}$/)) {
        helperOrConditions.push({ _id: helperId });
      }

      await Helper.updateOne(
        { $or: helperOrConditions },
        { rating: parseFloat(avgRating.toFixed(1)), reviewCount: allReviews.length }
      );

      return res.status(201).json({
        message: 'Review submitted successfully',
        review: {
          id: newReview._id.toString(),
          helperId: newReview.helperId,
          userName: newReview.userName,
          userImage: newReview.userImage,
          rating: newReview.rating,
          comment: newReview.comment,
          date: newReview.date,
        },
      });
    }

    // Memory Store Fallback
    const fallbackReview = {
      id: `r_${Date.now()}`,
      helperId,
      userName,
      userImage: userImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      rating: Number(rating),
      comment,
      date: 'Just now',
    };
    memoryStore.reviews.unshift(fallbackReview);

    res.status(201).json({
      message: 'Review submitted successfully',
      review: fallbackReview,
    });
  } catch (error) {
    console.error('Error submitting review:', error.message);
    res.status(500).json({ message: 'Failed to submit review.' });
  }
});

module.exports = router;
