'use strict';

// Development specific configuration
// ==================================
module.exports = {
    datastore: {
        type: "memoryStore",
        config: {
            path: "./data/gb_20151004.json"
        }
    },
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 4200
};
