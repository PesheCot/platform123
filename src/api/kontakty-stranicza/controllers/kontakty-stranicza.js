'use strict';

/**
 * kontakty-stranicza controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::kontakty-stranicza.kontakty-stranicza', ({ strapi }) => ({
    async getContactsPage(ctx) {
        const results = await strapi.service('api::kontakty-stranicza.kontakty-stranicza').getContactsPage();
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    }
}));
