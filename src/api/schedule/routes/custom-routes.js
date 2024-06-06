'use strict';

/**
 * schedule router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/schedule',
            handler: 'schedule.findByGroup',
        },
        {
            method: 'GET',
            path: '/schedule_apparel',
            handler: 'schedule.findToApparel',
        },
    ]
}