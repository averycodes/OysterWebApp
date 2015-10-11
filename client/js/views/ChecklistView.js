/*global define */

define([
  'marionette',
  'templates',
  'underscore',
  'views/TaskView',
  'views/BasicAddItemView',
  'views/EditRecurringTaskRuleView',
  'views/MessageView',
  'models/Task',
  'models/TaskRule',
  'collections/TaskCollection',
  'collections/HistoryCollection'
], function (Marionette, templates, _, TaskView, BasicAddItemView,
      EditRecurringTaskRuleView, MessageView, Task, TaskRule,
      TaskCollection, HistoryCollection) {
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
      this.user = window.app.user;
    },

    onDomRefresh: function() {
      this.addItemForm = this.regionManager.addRegion(
        "addItemForm", "#add-item-form"
      );
      this.messageContainer = this.regionManager.addRegion(
        "messageContainer", "#message-container"
      )
      this.showBasicAdd();
      this.maybeShowMessage();
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
      this.addItemForm.show(new EditRecurringTaskRuleView({
        parent: this,
        uuid: this.guid(),
        model: new TaskRule({
          title: undefined,
          amount: app.user.get('small_amount'),
          frequency: undefined,
          scale: undefined,
          must_be_completed_by_time: undefined,
          must_be_completed_in_x_days: undefined,
          completable_by: 'Oyster'
        })
      }));
    },

    showBasicAdd: function() {
      this.addItemForm.show(new BasicAddItemView({
        parent: this,
      }));
    },

    maybeShowMessage: function() {
      var moment = require('moment'), // TODO: not requiring properly
          historyCollection = new HistoryCollection(),
          self=this;

      historyCollection.fetch().success(_.bind(function(coll) {
        var last_seen = moment(self.user.get('last_seen')),
            messages;

        messages = coll.filter(function(item) {
          return moment(item.updated).isAfter(last_seen)
        });

        if (messages.length > 0) {
          self.messageContainer.show(new MessageView({
            title: messages[0].title,
            count: messages.length - 1
          }));
        }

      }, {self: self}));

    },

    guid: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
  });
});
