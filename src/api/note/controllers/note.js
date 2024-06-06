'use strict';

/**
 * note controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::note.note', ({ strapi }) => ({
    async findByLesson(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::note.note').findByLesson(sanitizedId, user);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async createByLesson(ctx) {
        const user =  ctx.state.user;
        const sanitizedId = await this.sanitizeInput(ctx.params.id);
        const results = await strapi.service('api::note.note').createByLesson(sanitizedId, user, ctx);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
}));