'use strict';

/**
 * lesson router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/lessons/by_module/:slug',
            handler: 'lesson.findByModule',
        },
        {
            method: 'GET',
            path: '/lessons/:slug',
            handler: 'lesson.getContent',
        },
    ]
}