'use strict';

/**
 * book-private service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::book-private.book-private');
