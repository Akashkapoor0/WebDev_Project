const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/ExploreEase";


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("There was an error connecting to DB", err));

app.get("/listings", wrapAsync( async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
})
);

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
}) 

app.get("/listings/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
})
)


  app.post("/listings", wrapAsync( async (req, res,next) => {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
  
  })
);


app.get("/listings/:id/edit",wrapAsync( async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit",{listing})
})
);

app.put("/listings/:id",wrapAsync( async (req,res)=>{
  let {id} =req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`);
})
);


app.delete("/listings/:id",wrapAsync( async (req,res)=>{
  const {id} = req.params;
  console.log(id);
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
})
)

app.all("*",(_, __, next) => {
  next(new expressError(404, "Page not Found!"));
});

app.use((err, _, res, __) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Port is listening to ${port}`);
});


