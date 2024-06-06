'use strict';

/**
 * kontakty-stranicza service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kontakty-stranicza.kontakty-stranicza', ({ strapi }) => ({
    async getContactsPage() { 
        const contacts = await strapi.entityService.findMany('api::kontakty-stranicza.kontakty-stranicza', {});
        
        return contacts;
    }
}));