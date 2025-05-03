const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      // type: String,
      // default: "https://unsplash.com/photos/mountains-stars-and-lake-reflect-in-a-beautiful-nightscape-aCusqffy5sY",
      // set: (v) => 
      //   v === "" 
      //     ? "https://unsplash.com/photos/mountains-stars-and-lake-reflect-in-a-beautiful-nightscape-aCusqffy5sY" 
      //     : v,

      url: String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      // category: {
      //   type: String,
      //   enum: ["mountains", "arctic", "farms", "dessert"],
      // },
});


//delete all reviews from review schema related to that listing(when the listing is deleted)
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;







