/*global define */

define([
    'backbone',
    'models/Task'
], function (Backbone, Task) {
    'use strict';

    return Backbone.Collection.extend({
        model: Task,
        url: "/api/v1/history/"
    });
});
