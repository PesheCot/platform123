'use strict';

/**
 * schedule controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::schedule.schedule', ({ strapi }) => ({
    async findByGroup(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::schedule.schedule').findByGroup(user);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },

    async findToApparel(ctx) {
        const results = await strapi.service('api::schedule.schedule').findToApparel();

        return results;
    },
}));
