'use strict';

const { RedisHelper } = require('../helpers/RedisHelper');
const { CacheHelper } = require('../helpers/CacheHelper');

const cacheHelper = new CacheHelper();
const ttl         = process.env.REDIS_TTL;

class CacheController {
    constructor() {
        this.redis = new RedisHelper(ttl);
    }

    async insertItem(row) {
        try {
            console.log('CacheController received following row: ');
            console.log(row);

            let baseKey   = cacheHelper.buildBaseKey('KEY_NAME'); // you might want to change this
            let cacheData = {
                "field_1_name" : (typeof row.field_1_name.S != "undefined" ? row.field_1_name.S : ''),
                "field_2_name" : (typeof row.field_2_name.S != "undefined" ? row.field_2_name.S : '')
            };
            console.log('cached data: ');
            console.log(cacheData);
            await this.redis.insert(baseKey, JSON.stringify(cacheData));
        } catch (e) {
            console.error(`Insert data has failed: ${e.toString()}`);
        }
    }

    async deleteItem(row) {
        try {
            let baseKey = cacheHelper.buildBaseKey('KEY_NAME'); // you might want to change this
            await this.redis.remove(baseKey);
        } catch (e) {
            console.error(`Delete data has failed: ${e.toString()}`);
        }
    }
}

module.exports = {
    CacheController: CacheController
};
