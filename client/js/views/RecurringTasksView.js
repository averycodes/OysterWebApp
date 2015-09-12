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
        itemView: TaskRuleView,
        className: 'recurring-tasks-view ui four cards',

        initialize: function() {
            this.collection = new TaskRuleCollection();
            this.collection.fetch();
        },
    });
});
