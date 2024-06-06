'use strict';

/**
 * main service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::main.main', ({ strapi }) => ({
    async getMainPage() { 
        const main = await strapi.entityService.findMany('api::main.main', {
            fields: ['registration_title', 'registration_text', 'about_title', 'about_text', 'platform_works_title', 'company_title', 'company_text', 'company_link'],
            populate: ['blocks' , 'registration_picture', 'about_picture']
        });
        
        return main;
    }
}));