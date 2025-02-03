## Modelling Reviews: Parent Refrencing

## Creating and Getting Reviews

<!-- Challenge -->

1. Getting Reviews
2. Creating Reviews
3. Create controller file
4. Create Route Filte

## Populating Reviews

## Virtual Populate: Tours and Reviews

`Problem`: We have added tour ids in review model and now I want reviews ids in tour model. If we put ids in tour model as child reference then it create cubersome because a tour can have 1000 of reviews so we have to add 1000 of ids in db. Which is not a solution .So mongoose give us virtual populate. means add review data in tour data withour saving it in DB.

`Definition`: In Mongoose, virtual populate is a way to populate data from another collection without storing references in the database. Instead of maintaining a direct relationship via foreign keys (like ObjectId), virtual populate uses schema virtuals and relies on a dynamic lookup to retrieve related data.

// Virtual Populate the review data in tour document
`tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //tour field has id of tour in review model
  localField: '_id', // _id field has id of tour in tour model
});`

## Implement nested Routes

- MergeParam feature - It merges all the params comes from the parent to current router

## Indexing

explain method - shows the stats
`const doc = await features.query.explain();`

1. Single field Index : Indexing on price - So that it only checks tours which has price above value not all - Performance Optimization
   `tourSchema.index({ price: 1 });`

2. Compounding index
   `tourSchema.index({ price: 1, ratingsAverage: -1 });`

Dont put index on all fields. It takes resources and increase the cost. So think before you add indexes on the fields.

## API documentation

1. Go to postman
2. Add description to the collections, documentation and params if required
3. Then go to view documentation
4. click on publish
5. you will get one url
