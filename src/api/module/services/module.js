'use strict';

/**
 * module service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::module.module', ({ strapi }) => ({
    async getContent(slug) { 
        const module = await strapi.entityService.findMany('api::module.module', {
            fields: ['id', 'name', 'content'],
            filters: { slug, publishedAt: { $notNull: true } },
        });

        if (module.length > 0) {
            return module[0];
        }

        return;
    }
}));
