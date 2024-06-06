'use strict';

/**
 * schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

function dateToSQL(date) {
    return date.getFullYear() + '-' + 
    (date.getMonth() + 1).toString().padStart(2,0) + '-' + 
    date.getDate().toString().padStart(2,0);
}

function getMonday(d) {
    d = new Date(d);
    const day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1), // adjust when day is sunday
          new_date = new Date(d.setDate(diff));

    return dateToSQL(new_date);
}

function getLastDay(d, weeks = 4) {
    const date = new Date(d),
          new_date = new Date(date.setDate(date.getDate() + weeks * 7));

    return dateToSQL(new_date);
}

function getDateBorders(date) {
    const start = getMonday(date),
          end   = getLastDay(start);

    return { start, end }
}

function fillEmptyDay(schedules, borders) {
    let result      = [],
        now         = dateToSQL(new Date()),
        curren_date = new Date(borders.start),
        end_date    = new Date(borders.end);
     
    while (curren_date < end_date) {
        const curren_date_SQL = dateToSQL(curren_date),
              found           = schedules.find(schedule => schedule.date == curren_date_SQL),
              is_now          = curren_date_SQL == now,
              is_weekend      = (curren_date.getDay() == 0 || curren_date.getDay() == 6)

        let item = {};

        if (found) {
            item = {...found, now: is_now, is_weekend};
        } else {
            item = {
                date: dateToSQL(curren_date),
                now: is_now,
                is_weekend
            };
        }

        result.push(item);

        curren_date = new Date(curren_date.setDate(curren_date.getDate() + 1));
    }

    return result;
}

module.exports = createCoreService('api::schedule.schedule', ({ strapi }) => ({
    async findByGroup(user) {  
        const group = await strapi.db.query('api::group.group').findOne({
            select: ['id', 'name'],
            where: { students: user.id}
        });

        const borders = getDateBorders(new Date());

        const schedules = await strapi.entityService.findMany('api::schedule.schedule', {
            fields: ['date'],
            populate: {
                lesson: {
                    fields: ['id', 'name', 'slug', 'type', 'description'],
                }
            },
            filters: { 
                group: group.id,
                date: { 
                    $gte: borders.start 
                },
                date: { 
                    $lt: borders.end 
                }
            },
            sort: { date: 'ASC' },
        });

        return { 
            schedules: fillEmptyDay(schedules, borders),
            group_name: group.name 
        };
    },

    async findToApparel() {  
        const groups = await strapi.entityService.findMany('api::group.group', {});
        
        const borders = getDateBorders(new Date());

        let result = [];

        for (let index = 0; index < groups.length; index++) {
            const group = groups[index];
            if (group.for_apparel == true) {

                const schedules = await strapi.entityService.findMany('api::schedule.schedule', {
                    fields: ['date'],
                    populate: {
                        lesson: {
                            fields: ['id', 'name', 'slug', 'type', 'description'],
                        }
                    },
                    filters: { 
                        group: group.id,
                        date: { 
                            $gte: borders.start 
                        },
                        date: { 
                            $lt: borders.end 
                        }
                    },
                    sort: { date: 'ASC' },
                });
                
                result.push({
                    group: group.name,
                    schedules: await fillEmptyDay(schedules, borders)
                })

            }
        }

        return result
    }
}));
