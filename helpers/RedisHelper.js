'use strict';

const redis         = require('redis');
const { promisify } = require('util');
const host          = process.env.REDIS_HOST;
const port          = process.env.REDIS_PORT;

class RedisHelper {
    constructor(ttl) {
        this.redis = redis.createClient({
            host: host, port: port
        });
        this.ttl = ttl;
    }

    async insert(key, value) {
        try {
            let set = promisify(this.redis.set).bind(this.redis);
            // command EX sets TTL
            await set(key, value, 'EX', this.ttl).then(function (response) {
                if (response !== 'OK') {
                    console.error(`Redis set failed: ${JSON.stringify(response)}`);
                }
                console.info(`Redis set success:KEY: ${{ key }} VALUE: ${{ value }}`);
            });
        } catch (e) {
            console.error(`Insert failed: ${e.toString()}`);
        }
    }

    async remove(key) {
        await this.redis.delete(key, (err) => {
            if (err) {
                console.error(`Delete failed:KEY: ${{ key }} ERROR: ${err.toString()}`);
            } else {
                console.info(`DELETED, KEY: ${{ key }}`);
            }

        });
    }
}

module.exports = {
    RedisHelper: RedisHelper
};
