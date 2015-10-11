/*global define */

define([
  'marionette',
  'templates'
], function (Marionette, templates) {
  'use strict';

  return Marionette.CompositeView.extend({
    template: templates.message,

    templateHelpers: function() {
      return {
        task_title: this.title,
        task_count: this.count
      }
    },

    events: {
      'click .close': 'onClickClose'
    },

    initialize: function(options) {
      this.title = options.title;
      this.count = options.count;
    },

    onClickClose: function(e) {
      e.preventDefault();
      this.destroy();
    }

  });
});
