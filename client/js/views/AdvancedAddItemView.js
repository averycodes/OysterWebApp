/*global define */

define([
  'marionette',
  'underscore',
  'templates',
  'app'
], function (Marionette, _, templates, app) {
  'use strict';

  return Marionette.Layout.extend({
    template: templates.advancedadditem,

    events: {
      'click .cancel': 'onClickCancel',
      'click .frequency-button': 'onChangeFrequency',
      'click .add-task': 'onAddTask',
      'click .amount-button': 'onChangeAmount',
      'click .completion-button': 'onChangeCompletion'
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
        'large': user.get('large_amount'),
        'url': this.url()
      };
    },

    initialize: function(options) {
      this.parent = this.options.parent;
    },

    onDomRefresh: function() {
      this.frequency = 'once';
      this.amount = app.user.get('small_amount');
      this.completion = 'Oyster';
      this.updateFrequencyUI();
      this.updateCompletionUI();
    },

    onClickCancel: function(e) {
      e.preventDefault();
      this.parent.showBasicAdd();
    },

    onChangeAmount: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass('custom')) {
        this.amount = undefined;
      } else {
        this.amount = $(e.target).attr('data-amount');
      }

      this.updateAmountUI();
    },

    onChangeCompletion: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass('Oyster')) {
        this.completion = 'Oyster';
      } else {
        this.completion = 'IFTTT';
      }

      this.updateCompletionUI();
    },

    updateAmountUI: function() {
      $(this.el).find('.amount-button').removeClass('primary');

      var active = $(this.el).find('[data-amount="'+this.amount+'"]');
      if (active.length) {
        active.addClass('primary');
      } else {
        $(this.el).find('.amount-button.custom').addClass('primary');
        // todo show custom input
      }
    },

    onChangeFrequency: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass('daily')) {
        this.frequency = 'daily';
      } else if ($(e.target).hasClass('weekly')) {
        this.frequency = 'weekly';
      } else if ($(e.target).hasClass('anytime')) {
        this.frequency = 'anytime';
      }else if ($(e.target).hasClass('custom')) {
        this.frequency = 'custom';
      } else {
        this.frequency = 'once';
      }

      this.updateFrequencyUI();
    },

    updateCompletionUI: function() {
      $(this.el).find('.completion-button').removeClass('primary');
      $(this.el).find('.completion-button.' + this.completion).addClass('primary');
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
        csrftoken = Cookies.get('csrftoken'),
        data;

      data = {
        'title': title,
        'amount': this.amount,
        'uuid': this.ifttt_guid,
        'completable_by': this.completion
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

    url: function() {
      if (!this.ifttt_guid) {
        this.ifttt_guid = this.guid();
      }
      return "http://oystr.herokuapp.com/api/v1/rules/" + this.ifttt_guid + "/completed/";
    }
  });
});
