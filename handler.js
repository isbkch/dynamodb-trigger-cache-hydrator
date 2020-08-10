'use strict';

const { RedisController } = require('./controllers/RedisController');
const { CacheHelper }     = require('./helpers/CacheHelper');

const cacheHelper     = new CacheHelper();
const redisController = new RedisController();

module.exports.process = async event => {
  await cacheHelper.asyncForEach(event.Records, async (record) => {
    if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
      let row = record.dynamodb.NewImage;
      console.log(record.eventName + ' triggered');
      await redisController.insertItem(row);
    }

    if (record.eventName === 'REMOVE') {
      let row = record.dynamodb.OldImage;
      console.log(record.eventName + ' triggered');
      await redisController.deleteItem(row);
    }
  });
};
