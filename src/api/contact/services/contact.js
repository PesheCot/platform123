'use strict';

/**
 * contact service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::contact.contact', ({ strapi }) => ({
    async getContacts() { 
        const contacts = await strapi.entityService.findMany('api::contact.contact', {
            fields: ['phone', 'email', 'work_time', 'work_years', 'company_name'],
            populate: ['logo']
        });
        
        return contacts;
    }
}));