/*global define */

define([
  'marionette',
  'templates',
  'underscore'
], function (Marionette, templates, _) {
  'use strict';

  return Marionette.ItemView.extend({
    className: 'edit-recurring-task-rule-view',
    template: templates.editrecurringtaskview,

    templateHelpers: function() {
      var user = window.app.user;
      return {
      'small': user.get('small_amount'),
      'mid': user.get('mid_amount'),
      'large': user.get('large_amount')
      };
    },

    events: {
      'click .frequency-button': 'onChangeFrequency',
    },

    onDomRefresh: function() {
      // this.frequency = 'once';
      // this.amount = window.app.user.get('small_amount');
      // this.completion = 'Oyster';
      this.updateFrequencyUI();
      // this.updateCompletionUI();
    },

    onChangeFrequency: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass('daily')) {
        this.model.set({
          frequency: 1,
          scale: 'day'
        });
      } else if ($(e.target).hasClass('weekly')) {
        this.frequency = 'weekly';
      } else if ($(e.target).hasClass('completion')) {
        this.frequency = 'completion';
      }else if ($(e.target).hasClass('custom')) {
        this.frequency = 'custom';
      }

      this.updateFrequencyUI();
    },

    updateFrequencyUI: function() {
      var freq = this.model.get('frequency'),
          scale = this.model.get('scale'),
          completion = this.model.get('regenerate_on_completion'),
          set_frequency_to;

      if (freq == 1 && scale == 'day') {
        set_frequency_to = 'daily';
      } else if (freq == 1 && scale == 'week') {
        set_frequency_to = 'weekly';
      } else if (completion) {
        set_frequency_to = 'completion';
      } else if (freq && scale) {
        set_frequency_to = 'custom';
      } else {
        set_frequency_to = 'never';
      }

      $(this.el).find('.frequency-button').removeClass('primary');
      $(this.el).find('.frequency-button.' + set_frequency_to).addClass('primary');

      // if (set_frequency_to == 'custom') {
      //   this.ui.customFrequency.show();
      // } else {
      //   this.ui.customFrequency.hide();
      // }
    },

  });
});