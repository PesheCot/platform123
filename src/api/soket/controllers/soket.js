'use strict';

/**
 * soket controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::soket.soket', ({ strapi }) => ({
    async getData(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::soket.soket').getData(user, ctx);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
    async setData(ctx) {
        const user =  ctx.state.user;
        const results = await strapi.service('api::soket.soket').setData(user, ctx);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults);
    },
})
);
