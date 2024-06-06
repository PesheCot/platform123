'use strict';

/**
 * feedback router
 */

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/feedback/user_question',
            handler: 'feedback.userQuestion',
        },
        {
            method: 'GET',
            path: '/feedback/all_teacher_question',
            handler: 'feedback.questionsForTeacher',
        },
        {
            method: 'GET',
            path: '/feedback/all_user_question',
            handler: 'feedback.questionsForUser',
        },
        {
            method: 'GET',
            path: '/feedback/one_teacher_question/:id',
            handler: 'feedback.questionForTeacher',
        },
        {
            method: 'GET',
            path: '/feedback/one_user_question/:id',
            handler: 'feedback.questionForUser',
        },
        {
            method: 'POST',
            path: '/feedback/create_comment/:id',
            handler: 'feedback.createComment',
        },
        {
            method: 'GET',
            path: '/feedback/user_comments',
            handler: 'feedback.commentsForUser',
        },
        {
            method: 'GET',
            path: '/feedback/teacher_comments',
            handler: 'feedback.commentsForTeacher',
        },
        {
            method: 'GET',
            path: '/feedback/:id/comments',
            handler: 'feedback.commentsForQuestion',
        }
    ]
}