//Express Router: are a way to organize your Express application such that our primary app.js file does not become bloated.
//Restructuring Reviews

const express = require("express");
//creating new router object
const router = express.Router({ mergeParams: true });  //mergeParams: true (Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence.)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//Review Route
router.post(
    "/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId", 
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);



module.exports = router;
