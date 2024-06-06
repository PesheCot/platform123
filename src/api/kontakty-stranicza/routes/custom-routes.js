'use strict';

/**
 * kontakty-stranicza router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/contacts_page',
            handler: 'kontakty-stranicza.getContactsPage',
        },
    ]
}