const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams merges aal the params comes on this route

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router.use(authController.protect); //Authentication

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'), //Authorization
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReviews)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );
module.exports = router;
