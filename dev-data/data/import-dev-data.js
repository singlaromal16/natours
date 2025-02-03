const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // fetch env variable from config file
const Tour = require('./../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
dotenv.config({ path: './../../config.env' });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log('DB connected');
});

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
// const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
// const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));

// Import Data Into DB
async function importDataIntoDB() {
  try {
    console.log(tours);
    await Tour.create(tours);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('Data successfully imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importDataIntoDB();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// importDataIntoDB().then((data) => {
//     console.log(data);
//   });
