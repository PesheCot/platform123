'use strict';

/**
 * note service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::note.note', ({ strapi }) => ({
async findByLesson(id, user) { 
    const note = await strapi.entityService.findMany('api::note.note', {
        fields: ['id', 'content', 'updated_at'],
        filters: { lesson: id, user: user.id },
    });

    if (note.length > 0) {
        note[0].data_parse = Date.parse(note[0].updatedAt);
        return note[0];
    }

    return;
},
async createByLesson(id, user, ctx) { 
    const note = await strapi.entityService.findMany('api::note.note', {
        fields: ['id', 'content'],
        filters: { lesson: id, user: user.id },
    });
    if (note.length > 0) {
        const entry = await strapi.entityService.update('api::note.note', note[0].id, {
            data: {
                user: user.id,
                lesson: id,
                content: ctx.request.body.content
            },
        });
        return entry;
    } else {
        const entry = await strapi.entityService.create('api::note.note', {
            data: {
                user: user.id,
                lesson: id,
                content: ctx.request.body.content
            },
        });
        return entry;
    } 
    
}
}));
