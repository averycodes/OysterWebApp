/*global define */

define([
    'backbone',
    'models/Wish'
], function (Backbone, Wish) {
    'use strict';

    return Backbone.Collection.extend({
        model: Wish,
        url: "/api/v1/wishes/"
    });
});
