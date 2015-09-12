/*global define */

define([
  'marionette',
  'views/ChecklistView',
  'collections/TaskCollection',
  'views/WishlistView',
  'collections/WishCollection',
  'views/HistoryView',
  'views/RecurringTasksView',
], function (Marionette, ChecklistView, TaskCollection, WishlistView, WishCollection,
             HistoryView, RecurringTasksView) {
  'use strict';

  return Marionette.AppRouter.extend({
    routes : {
      "checklist": "showChecklist",
      "wishlist": "showWishlist",
      "history": "showHistory",
      "recurring-tasks": "showRecurring",
      "" : "showChecklist",
    },

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


  });
});


