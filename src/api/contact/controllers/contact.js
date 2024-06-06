'use strict';

/**
 * contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
    async getContacts(ctx) {
        const results = await strapi.service('api::contact.contact').getContacts();
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    }
}));