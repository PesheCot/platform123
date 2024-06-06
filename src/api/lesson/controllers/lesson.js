'use strict';

/**
 * lesson controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lesson.lesson', ({ strapi }) => ({
    async findByModule(ctx) {
        const user =  ctx.state.user;
        const sanitizedSlug = await this.sanitizeInput(ctx.params.slug);
        const results = await strapi.service('api::lesson.lesson').findByModule(sanitizedSlug, user);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async getContent(ctx) {
        const user =  ctx.state.user;
        const sanitizedSlug = await this.sanitizeInput(ctx.params.slug);
        const results = await strapi.service('api::lesson.lesson').getContent(sanitizedSlug, user);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    }
}));
