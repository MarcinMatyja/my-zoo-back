'use strict';

/**
 * finding router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::finding.finding');
