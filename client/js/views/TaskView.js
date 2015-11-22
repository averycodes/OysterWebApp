/*global define */

define([
  'marionette',
  'templates',
  'underscore',
  'app'
], function (Marionette, templates, _, app) {
  'use strict';

  return Marionette.ItemView.extend({
    className: 'task-view item',
    template: templates.task,

    ui: {
      'remove': '.remove',
      'edit': '.edit',
      'feature': '.feature',
      'task': '.task',
      'editTask': '.edit-task',
      'newTitle': '.new-title',
      'newAmount': '.new-amount'
    },

    events: {
      'click .task': 'onClickTask',
      'click .remove': 'onClickRemove',
      'click .edit': 'onClickEdit',
      'click .feature': 'onClickFeature',
      'click .save-task': 'onClickSaveTask',
      'mouseover': 'onHover',
      'mouseout': 'onStopHover'
    },

    onRender: function() {
      if (!this.model.get('doable')) {
        $(this.el).addClass('disabled');
      }
      this.ui.remove.hide();
      this.ui.edit.hide();
      this.ui.feature.hide();
      this.ui.editTask.hide();
      // event listener
    },

    onClickTask: function(e) {
      e.preventDefault();
      if (this.model.get('doable')) {
        this.model.set('completed', true);
        this.model.save();

        var user = window.app.user,
          bank_amt = user.get("bank");

        user.set("bank", bank_amt + this.model.get("amount"));

        this.destroy();
      }
    },

    onClickRemove: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.model.destroy();
      this.destroy();
    },

    onClickFeature: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.model.set('featured', !(this.model.get('featured')));
      this.model.save();
    },

    onClickEdit: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.task.hide();
      this.ui.editTask.show();
    },

    onClickSaveTask: function(e) {
      e.preventDefault();
      this.model.set('title', this.ui.newTitle.val());
      this.model.set('amount', this.ui.newAmount.val());
      this.model.save();
    },

    onHover: function() {
      if(!window.mobile) {
        this.ui.remove.show();
        this.ui.edit.show();
        this.ui.feature.show();
      }
    },

    onStopHover: function() {
      if (!window.mobile) {
        this.ui.remove.hide();
        this.ui.edit.hide();
        this.ui.feature.hide();
      }
    }
  });
});
