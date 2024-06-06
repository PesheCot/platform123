'use strict';

/**
 * main_page router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/main',
            handler: 'main.getMainPage',
        },
    ]
}