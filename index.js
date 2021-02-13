'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/vue-query.common.prod');
} else {
    module.exports = require('./dist/vue-query.common');
}
