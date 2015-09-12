/*global define */

define([
  'marionette',
  'templates',
  'underscore',
  'views/TaskView',
  'views/BasicAddItemView',
  'views/AdvancedAddItemView',
  'models/Task',
  'collections/TaskCollection'
], function (Marionette, templates, _, TaskView, BasicAddItemView,
      AdvancedAddItemView, Task, TaskCollection) {
  'use strict';

  return Marionette.CompositeView.extend({
    template: templates.checklist,
    className: 'checklist-view',
    childView: TaskView,
    childViewContainer: '.checklist-items',

    attachHtml: function(compositeView, itemView, index) {
      return compositeView.$el.find(compositeView.childViewContainer).prepend(itemView.el);
    },

    initialize: function() {
      this.regionManager = new Marionette.RegionManager();
    },

    onDomRefresh: function() {
      this.addItemForm = this.regionManager.addRegion(
        "addItemForm", "#add-item-form"
      );
      this.showBasicAdd();
    },

    onClose: function() {
      this.regionManager.close();
    },

    addTaskWithReward: function(task, amount) {
      task = new Task({
        title: task,
        amount: amount,
        doable: true,
        is_credit: true
      });
      task.save();
      this.collection.add(task);

      this.showBasicAdd();
    },

    showAdvancedAdd: function() {
      this.addItemForm.show(new AdvancedAddItemView({
        parent: this
      }));
    },

    showBasicAdd: function() {
      this.addItemForm.show(new BasicAddItemView({
        parent: this
      }));
    }
  });
});
