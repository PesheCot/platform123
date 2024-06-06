'use strict';

/**
 * main controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::main.main', ({ strapi }) => ({
    async getMainPage(ctx) {
        const results = await strapi.service('api::main.main').getMainPage();
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    }
}));