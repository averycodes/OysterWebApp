/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'views/TaskRuleView',
    'collections/TaskRuleCollection',
], function (Marionette, templates, _, TaskRuleView, TaskRuleCollection) {
    'use strict';

    return Marionette.CollectionView.extend({
        // template: templates.recurring_tasks,
        itemView: TaskRuleView,
        // itemViewContainer: '.task-rule-items',

        initialize: function() {
            // this.regionManager = new Marionette.RegionManager();
            this.collection = new TaskRuleCollection();
            this.collection.fetch();
        },
    });
});
