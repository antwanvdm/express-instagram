const InstagramAPI = require('instagram-api');
const InstagramMongo = {};

/**
 * Initialize magic
 *
 * @param db
 * @returns {Promise<void>}
 */
InstagramMongo.init = async (db) => {
  //Ugly hard coded token
  let accessToken = '253879763.1677ed0.a4df2b2a9f4c4e8ab0cf9b71014b4d4b';
  let instagramAPI = new InstagramAPI(accessToken);

  //Get all instagram data from API
  let items = await InstagramMongo.getUserSelfMedia(instagramAPI, [], null, null);
  db.collection('items').removeMany({});
  db.collection('items').insertMany(items);
};

/**
 * Fetch data from current user of Instagram (see access token)
 *
 * @param instagramAPI
 * @param currentData
 * @param nextMaxId
 * @param tag
 * @returns {Promise<[]>}
 */
InstagramMongo.getUserSelfMedia = async (instagramAPI, currentData, nextMaxId, tag) => {
  return new Promise((resolve, reject) => {
    instagramAPI.userSelfMedia({max_id: nextMaxId}).then(async (result) => {
      //Get data from Instagram & filter on given tag when available
      let filteredData = tag === null ? result.data : result.data.filter((item) => {
        return item.tags.indexOf(tag) > -1;
      });

      //Concat with currentData & get maxId to define net step
      let data = currentData.concat(filteredData);
      let nextMaxId = result.pagination.next_max_id;
      console.log(nextMaxId);

      //Check if there is still a maxId available to retrieve all the images
      if (typeof nextMaxId !== 'undefined' && nextMaxId !== 'undefined') {
        data = await InstagramMongo.getUserSelfMedia(instagramAPI, data, nextMaxId, tag);
      }

      //'return' data
      resolve(data);
    }, (error) => {
      //Make a better error..
      console.log(error);
      reject(error);
    });
  });
};

module.exports = InstagramMongo;
