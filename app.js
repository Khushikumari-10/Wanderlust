if(process.env.NODE_ENV != "production") { 
  require('dotenv').config();
}
// console.log(process.env);
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");  //requiring joi schema
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err)
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//for storing session related information
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,  //resave: Forces the session to be saved back to the session store, even if the session was never modified during the request.
  saveUninitialized: true,  //saveUninitialized: Forces a session that is "uninitialized" to be saved to the store.
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// app.get("/", (req,res) => {
//     res.send("Hi, I am root");
// });


app.use(session(sessionOptions));    //middleware
app.use(flash());


//Configuring Strategy
app.use(passport.initialize());  //A middleware that initializes passport.
app.use(passport.session());   //A web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session.
passport.use(new LocalStrategy( User.authenticate() ));  // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// //validation for schema(middleware)
// //for Listing
// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    // console.log(res.locals.success);
    next();
});



// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "khushi@gmail.com",
//     username: "lucky",
//   });

//   let registeredUser = await User.register(fakeUser,"hello"); //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
//   //pbkdf2 algorithm use for hashing
//   res.send(registeredUser);
// });



app.use("/listings", listingRouter); //is used to mount a router middleware (listings) at a specific path (/listings)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// //validation for schema(middleware)
// //for Review
// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };



//listing Routes(now import from /"routes/listing.js")

// //Index Route
// app.get("/listings", wrapAsync(async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }));

// //New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// //Show Route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { listing });
// }));


// //Create Route
// //try & catch
// // app.post("/listings", async (req, res, next) => {
// //   try {
// //     const newListing = new Listing(req.body.listing);
// //     await newListing.save();
// //     res.redirect("/listings");
// //   } catch(err) {
// //     next(err);
// //   }
// // });

// //using wrapAsync
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//   // if(!req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing");
//   // }

//   // let result = listingSchema.validate(req.body);
//   // console.log(result);
//   // if( result.error ) {
//   //   throw new ExpressError(400, result.error);
//   // }

//   const newListing = new Listing(req.body.listing);

//   // if(!newListing.title) {
//   //   throw new ExpressError(400, "title is missing");
//   // }
//   // if(!newListing.description) {
//   //   throw new ExpressError(400, "description is missing");
//   // }
//   // if(!newListing.location) {
//   //   throw new ExpressError(400, "location is missing");
//   // }

//   await newListing.save();
//   res.redirect("/listings");
// }));


// //Edit Route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  
//   // if(!req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing");
//   // }

//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// }));



// //Review Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`);
// }));

// //Delete Review Route
// app.delete(
//   "/listings/:id/reviews/:reviewId", 
//   wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;

//     //mongo $pull operator: removes from an existing array all instances of a value or values that match a specified condition.
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
//   })
// );



// app.get("/testListing", async (req,res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     Country: "India",
//   });
//   await sampleListing.save();
//   console.log("Sample was send");
//   res.send("Successful testing");
// });

  
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});

//Error handling middleware
app.use((err, req, res, next) => {
  // res.send("something went wrong!");
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});


