'use strict';

/**
 * note router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/note/by_lesson/:id',
            handler: 'note.findByLesson',
        },
        {
            method: 'POST',
            path: '/note/by_lesson/:id',
            handler: 'note.createByLesson',
        },
    ]
}