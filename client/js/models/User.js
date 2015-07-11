/*global define */

define([
    'backbone'
], function (Backbone) {
    'use strict';

    return Backbone.Model.extend({
        url: '/api/v1/profile/',

        defaults: {
            bank: 0
        }
    });
});
