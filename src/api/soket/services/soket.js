'use strict';

/**
 * soket service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const myHelper = require('../../../../helpers/websocket.js')

module.exports = createCoreService('api::soket.soket', ({ strapi }) => ({
        async getData(user, ctx) { 
            const data = await strapi.entityService.findOne('api::soket.soket', {} );
            return data;
        },
        async setData(user, ctx) { 
            const data = await strapi.entityService.update('api::soket.soket', 1, {
                data: {
                    json: ctx.request.body.json,
                },
            } );
            return data;
        }
    })
);