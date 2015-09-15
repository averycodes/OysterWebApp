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
    childView: TaskRuleView,
    className: function() {
      if (window.mobile) {
        return 'recurring-tasks-view ui one cards';
      } else {
        return 'recurring-tasks-view ui four cards';
      }
    },

    viewComparator: 'cancelled',

    initialize: function() {
      this.collection = new TaskRuleCollection();
      this.collection.fetch();
    },
  });
});
