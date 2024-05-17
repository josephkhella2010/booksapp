'use strict';

/**
 * book-private controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book-private.book-private');
