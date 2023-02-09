'use strict';

const { CacheHelper }     = require('../helpers/CacheHelper');
const { CacheController } = require('../controllers/CacheController');

const cacheHelper     = new CacheHelper();
const cacheController = new CacheController();

module.exports.process = async event => {
  await cacheHelper.asyncForEach(event.Records, async (record) => {
    if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
      let row = record.dynamodb.NewImage;
      console.log(record.eventName + ' triggered');
      await cacheController.insertItem(row);
    }

    if (record.eventName === 'REMOVE') {
      let row = record.dynamodb.OldImage;
      console.log(record.eventName + ' triggered');
      await cacheController.deleteItem(row);
    }
  });
};
