const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 char'],
      minlength: [10, 'A tour name must have greater or equal 10 char'],
      // validate: [validator.isAlpha, 'Tour name must only contains characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium and difficult',
      }, // Validators
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below than 5.0'], // Validators
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW doc creation
          return val < this.price; // pricediscount should be less than price
        },
        message: 'Discount price ({VALUE}) should be below regular price ',
      },
    }, // Custom Validator
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //to exclude this fields
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //Geospatial JSON
      type: {
        type: String,
        default: 'Point', // Polygon,
        enum: ['Point'],
      },
      coordinate: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point', // Polygon,
          enum: ['Point'],
        },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ], //Embedded document/Denormalised
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }], //Referencing document
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Single field Index :
// Indexing on price - So that it only checks tours which has price above value not all - Performance Optimization
// tourSchema.index({ price: 1 });
// Compounding index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); // because of this we get map when we Analyse in compass

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate the review data in tour document
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //tour field has id of tour in review model
  localField: '_id', // _id field has id of tour in tour model
});

// Mongoose MiddleWares
// 1) DOCUMENT MIDDLEWARE or pre save hook or pre save middleware : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// **** Embed complete guide user info instead of id which is not a case in this app. Eg if we want to update user we have to update tour as well
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save doc');
//   next();
// });

///// post save hook : runs after all the pre hook runs and return saved doc
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// 2) QUERY MIDDLEWARE - runs before and after any query execute
// for all find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  }); // add the guide data on the place of ids and it is used in case of normalised
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

// 3) AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema); // Model is a blueprint / Template of the collection to create documents

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   price: 297,
//   rating: 4.7,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error', err);
//   });

module.exports = Tour;
