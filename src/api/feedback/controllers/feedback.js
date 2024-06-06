'use strict';

/**
 * feedback controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::feedback.feedback', ({ strapi }) => ({
    async userQuestion(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::feedback.feedback').userQuestion(user, ctx);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async questionsForTeacher(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::feedback.feedback').questionsForTeacher(user);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async questionsForUser(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::feedback.feedback').questionsForUser(user);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async questionForTeacher(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::feedback.feedback').questionForTeacher(user, sanitizedId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async questionForUser(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::feedback.feedback').questionForUser(user, ctx, sanitizedId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async createComment(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::feedback.feedback').createComment(user, ctx, sanitizedId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async commentsForUser(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::feedback.feedback').commentsForUser(user, sanitizedId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async commentsForTeacher(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::feedback.feedback').commentsForTeacher(user, ctx, sanitizedId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async commentsForQuestion(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::feedback.feedback').commentsForQuestion(user, sanitizedId);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
}));