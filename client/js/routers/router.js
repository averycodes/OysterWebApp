/*global define */

define([
  'marionette',
  'models/TaskRule',
  'collections/TaskCollection',
  'collections/WishCollection',
  'views/ChecklistView',
  'views/WishlistView',
  'views/HistoryView',
  'views/RecurringTasksView',
  'views/EditRecurringTaskRuleView',
], function (Marionette, TaskRule, TaskCollection, WishCollection, ChecklistView,
             WishlistView, HistoryView, RecurringTasksView, EditRecurringTaskRuleView) {
  'use strict';

  return Marionette.AppRouter.extend({
    routes : {
      "checklist": "showChecklist",
      "wishlist": "showWishlist",
      "history": "showHistory",
      "recurring-task-rule/:uuid": "showEditRecurringTaskRule",
      "recurring-tasks": "showRecurring",
      "" : "showChecklist",
    },

    // onRoute: function(name, path, args) {
    //   debugger;
    // },

    showChecklist : function() {
      var checklist_items = new TaskCollection();
      checklist_items.fetch();
      window.app.main.show(new ChecklistView({collection: checklist_items}));

      $(".nav-item").removeClass("active");
      $(".checklist-nav").addClass("active");
    },

    showWishlist : function() {
      var wishlist_items = new WishCollection();
      wishlist_items.fetch();
      window.app.main.show(new WishlistView({collection: wishlist_items}));

      $(".nav-item").removeClass("active");
      $(".wishlist-nav").addClass("active");
    },

    showHistory : function() {
      // var wishlist_items = new WishCollection();
      // wishlist_items.fetch();
      window.app.main.show(new HistoryView());

      $(".nav-item").removeClass("active");
      $(".history-nav").addClass("active");
    },

    showRecurring : function() {
      // var wishlist_items = new WishCollection();
      // wishlist_items.fetch();
      window.app.main.show(new RecurringTasksView());

      $(".nav-item").removeClass("active");
      $(".recurring-nav").addClass("active");
    },

    showEditRecurringTaskRule : function(uuid) {
      var taskRule = new TaskRule({
        uuid:uuid
      });
      taskRule.fetch();

      taskRule.on("change", function() {
        window.app.main.show(new EditRecurringTaskRuleView({
          model: taskRule
        }));
      }, this);

      $(".nav-item").removeClass("active");
      $(".recurring-nav").addClass("active");
    },


  });
});


