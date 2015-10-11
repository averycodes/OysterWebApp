/*global define */

define([
    'backbone',
    'models/Task'
], function (Backbone, Task) {
    'use strict';

    return Backbone.Collection.extend({
        model: Task,
        url: "/api/v1/tasks/",
        comparator: function(task) {
            return task.get("doable") + task.get("created")
        }
    });
});
