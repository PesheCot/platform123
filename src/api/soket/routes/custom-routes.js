'use strict';

/**
 * review router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/socket/getData',
            handler: 'soket.getData',
        },
        {
            method: 'POST',
            path: '/socket/setData',
            handler: 'soket.setData',
        },
    ]
}