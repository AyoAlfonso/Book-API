'use strict'

exports.findWeightedMean = (num) => {
/**
 *  @description OUR ADHOC STANDARD FOR CALCULATING REVIEWS
 */
   let ratings = {
        1: 0.1,
        2: 0.3,
        3: 0.5,
        4: 0.7,
        5: 0.9,
        6: 1.1,
        7: 1.1,
        8: 1.5,
        9: 1.8,
        10:2.0,
    }
   return ratings[num];
};