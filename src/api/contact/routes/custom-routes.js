'use strict';

/**
 * contacts router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/contacts',
            handler: 'contact.getContacts',
        },
    ]
}