/*global define */

define([
    'backbone',
    'models/TaskRule'
], function (Backbone, TaskRule) {
    'use strict';

    return Backbone.Collection.extend({
        model: TaskRule,
        url: "/api/v1/rules/"
    });
});
