let express = require('express');
let router = express.Router();

/**
 * @param db
 * @returns {*}
 */
module.exports = (db) => {
  let collection = db.collection('items');

  /**
   * Default instagram route
   */
  router.get('/', async (request, response, next) => {
    let currentTag = request.query.tag || "";
    let tagQuery = currentTag !== "" ? {tags: {$in: [currentTag]}} : {};

    //Get all results from collection
    collection.find(tagQuery).sort({created_time: -1}).toArray(function (err, docs) {
      response.render('instagram', {title: 'Instagram Grid', posts: docs, currentTag: currentTag});
    });
  });

  /**
   * AJAX route for receiving 1 image with data
   */
  router.get('/api/photo/:id', async (request, response, next) => {
    let requestedId = request.params.id;
    let photoQuery = {id: requestedId};

    //Get one result based on ID
    collection.findOne(photoQuery, function (err, doc) {
      response.send(doc);
    });
  });

  /**
   * AJAX route to fetch new data from instagram
   */
  router.get('/api/fetchdata', async (request, response, next) => {
    let InstagramMongo = require('../tasks/instagram-mongo');
    await InstagramMongo.init(db);
    response.send({"status": "DONE"});
  });

  return router;
};
