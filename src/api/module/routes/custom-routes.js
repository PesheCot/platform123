'use strict';

/**
 * module router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/module/:slug',
            handler: 'module.getContent',
        },
    ]
}