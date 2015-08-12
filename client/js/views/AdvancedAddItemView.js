/*global define */

define([
  'marionette',
  'underscore',
  'templates',
  'app',
  'views/TaskCompletionView'
], function (Marionette, _, templates, app, TaskCompletionView) {
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

    ui: {
      'customFrequency': '.custom-frequency',
      'title': '.new-task'
    },

    templateHelpers: function() {
      var user = app.user;
      return {
        'small': user.get('small_amount'),
        'mid': user.get('mid_amount'),
        'large': user.get('large_amount')
      };
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

      if (this.frequency == 'custom') {
        this.ui.customFrequency.show();
      } else {
        this.ui.customFrequency.hide();
      }
    },

    onAddTask: function(e) {
      e.preventDefault();

      var title=this.ui.title.val(),
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
      } else if (this.frequency == 'custom') {
        data['frequency'] = $(this.el).find('input.frequency').val();
        data['scale'] = $(this.el).find('input.scale').val();
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
