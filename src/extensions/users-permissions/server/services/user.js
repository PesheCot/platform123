'use strict';
/**
 * User.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = ({ strapi }) => ({
    /**
   * Promise to fetch authenticated user.
   * @return {Promise}
   */
  fetchAuthenticatedUser(id) {
    return strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { id }, populate: ['role'] });
  },
});