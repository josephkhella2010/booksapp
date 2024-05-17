'use strict';

/**
 * book-private router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::book-private.book-private');
