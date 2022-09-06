'use strict';

/**
 * finding service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::finding.finding');
