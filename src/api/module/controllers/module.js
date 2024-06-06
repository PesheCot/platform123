'use strict';

/**
 * module controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::module.module', ({ strapi }) => ({
    async getContent(ctx) {
        const sanitizedSlug = await this.sanitizeInput(ctx.params.slug);
        const results = await strapi.service('api::module.module').getContent(sanitizedSlug);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    }
}));