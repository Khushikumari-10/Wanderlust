//Express Router
//Restructuring Listings

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



// //Index Route
// router.get("/", wrapAsync(listingController.index));
// //Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router
    .route("/")
    .get(wrapAsync(listingController.index))    //Index Route
    .post(
      isLoggedIn, 
      validateListing, 
      upload.single('listing[image]'), 
      wrapAsync(listingController.createListing)
    );    //Create Route
  

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// //Show Route
// router.get("/:id", wrapAsync(listingController.showListing));
// //Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.createListing));
// //Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))    //Show Route
    .put(
      isLoggedIn, 
      isOwner, 
      upload.single("listing[image]"), 
      validateListing, 
      wrapAsync(listingController.updateListing)
    )    //Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));    //Delete Route

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;