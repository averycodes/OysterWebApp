/*global define */

define([
  'marionette',
  'underscore',
  'templates',
  'views/TaskCompletionView'
], function (Marionette, _, templates, TaskCompletionView) {
  'use strict';

  return Marionette.Layout.extend({
    template: templates.advancedadditem,

    events: {
      'click .cancel': 'onClickCancel',
      'click .frequency-button': 'onChangeFrequency',
      'click .add-task': 'onAddTask'
    },

    regions: {
      taskCompletion: '#task-completion'
    },

    initialize: function(options) {
      this.parent = this.options.parent;
    },

    onDomRefresh: function() {
      this.taskCompletion.show(new TaskCompletionView());
      this.frequency = 'once';
      this.updateFrequencyUI();
    },

    onClickCancel: function(e) {
      e.preventDefault();
      this.parent.showBasicAdd();
    },

    onChangeFrequency: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass('daily')) {
        this.frequency = 'daily';
      } else if ($(e.target).hasClass('weekly')) {
        this.frequency = 'weekly';
      } else if ($(e.target).hasClass('custom')) {
        this.frequency = 'custom';
      } else {
        this.frequency = 'once';
      }

      this.updateFrequencyUI();
    },

    updateFrequencyUI: function() {
      $(this.el).find('.frequency-button').removeClass('primary');
      $(this.el).find('.frequency-button.' + this.frequency).addClass('primary');
    },

    onAddTask: function(e) {
      e.preventDefault();

      var title=$(this.el).find('.new-task').val(),
        amount = 10,
        csrftoken = Cookies.get('csrftoken'),
        data;

      data = {
        'title': title,
        'amount': amount
      }

      if (this.frequency == 'daily') {
        data['frequency'] = 1
        data['scale'] = 'day'
      } else if (this.frequency == 'weekly') {
        data['frequency'] = 1
        data['scale'] = 'week'
      }

      $.ajaxSetup({
          headers: {
              "X-CSRFToken": csrftoken
          }
      });

      $.ajax({
        type: "POST",
        url: '/api/v1/rules/',
        data: data,
        statusCode: {
          201: _.bind(function() {
            this.parent.render();
          }, this)
        }
      });
    }
  });
});
