'use strict';

/**
 * review router
 */

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/review/by_lesson/:id',
            handler: 'review.postTask',
        },
        {
            method: 'POST',
            path: '/review/mark/:task_id/:lesson_id/:student_id',
            handler: 'review.putMark',
        },
        {
            method: 'POST',
            path: '/review/comment/:task_id/:lesson_id/:student_id',
            handler: 'review.createComment',
        },
        {
            method: 'GET',
            path: '/review/for_teacher',
            handler: 'review.getTasks',
        },
        {
            method: 'GET',
            path: '/review/:task_id/:lesson_id/:student_id',
            handler: 'review.getTask',
        },
        {
            method: 'GET',
            path: '/review/:task_id/:lesson_id',
            handler: 'review.getTaskForStudent',
        },
        {
            method: 'POST',
            path: '/revirew/getNotices',
            handler: 'review.getNotices',
        },
    ]
}