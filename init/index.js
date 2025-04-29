const mongoose = require("mongoose");
const Listing = require("../models/listing.js")
const initData = require("./data.js");
const { listIndexes } = require("../models/listing.js");
let MONGO_URL = "mongodb://127.0.0.1:27017/ExploreEase"
main().then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log("there was an error connecting to DB",err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB(){
    await Listing.deleteMany({});
    console.log("Deleted all listings")
    await Listing.insertMany(initData.data);
    console.log("Inserted all listings")
}
initDB();