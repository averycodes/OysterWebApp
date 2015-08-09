/*global define */

define([
    'backbone',
    'models/History'
], function (Backbone, History) {
    'use strict';

    return Backbone.Collection.extend({
        model: History,
        url: "/api/v1/history/"
    });
});
