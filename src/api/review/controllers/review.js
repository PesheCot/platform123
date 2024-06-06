'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
    async postTask(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::review.review').postTask(sanitizedId, user, ctx);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async getTasks(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::review.review').getTasks(user, ctx);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async getTask(ctx) {
        const user =  ctx.state.user;
        const taskId = await this.sanitizeInput(ctx.params.task_id);
        const lessonId = await this.sanitizeInput(ctx.params.lesson_id);
        const studentId = await this.sanitizeInput(ctx.params.student_id);
        const results = await strapi.service('api::review.review').getTask(user, ctx, taskId, lessonId, studentId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async putMark(ctx) {
        const user =  ctx.state.user;
        const taskId = await this.sanitizeInput(ctx.params.task_id);
        const lessonId = await this.sanitizeInput(ctx.params.lesson_id);
        const studentId = await this.sanitizeInput(ctx.params.student_id);
        const results = await strapi.service('api::review.review').putMark(user, ctx, taskId, lessonId, studentId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async createComment(ctx) {
        const user =  ctx.state.user;
        const taskId = await this.sanitizeInput(ctx.params.task_id);
        const lessonId = await this.sanitizeInput(ctx.params.lesson_id);
        const studentId = await this.sanitizeInput(ctx.params.student_id);
        const results = await strapi.service('api::review.review').createComment(user, ctx, taskId, lessonId, studentId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async getTaskForStudent(ctx) {
        const user =  ctx.state.user;
        const taskId = await this.sanitizeInput(ctx.params.task_id);
        const lessonId = await this.sanitizeInput(ctx.params.lesson_id);
        const studentId = await this.sanitizeInput(user.id);
        const results = await strapi.service('api::review.review').getTaskForStudent(user, ctx, taskId, lessonId, studentId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },

    async getNotices(ctx) {
        const clients = strapi.socket_clients;
        let res = strapi.$io.emit("api::review.review.someTests", 'test');
        const connectedClients = strapi.plugins.io;
        console.log(connectedClients);
        let socketId = ctx.request.body.socketId;
        console.log(socketId);
        let data = 'data';
        strapi.$io.raw("someTests", data, { room: socketId });
        ctx.send('Message sent to the specified socket.');
    },

    async someTests (data) {
        console.log(123);
        console.log(data);
    }

}));