'use strict';

class CacheHelper {
    constructor() {
        this.keyBase = 'PREFIX';
    }
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    buildBaseKey(userId) {
        return this.keyBase + userId;
    }
}
module.exports = {
    CacheHelper: CacheHelper
};