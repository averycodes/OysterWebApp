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
      var uuid = this.model.get('uuid') || this.uuid;
      return {
        'uuid': uuid,
        'small': this.small,
        'mid': this.mid,
        'large': this.large,
        'isNew': !(this.model.get('uuid'))
      };
    },

    events: {
      'blur .title': 'onUpdateTitle',
      'blur .frequency': 'onUpdateFrequency',
      'change .scale': 'onUpdateScale',
      'click .frequency-button': 'onChangeFrequency',
      'click .amount-button': 'onChangeAmount',
      'click .completion-button': 'onChangeCompletion',
      'click .overdue-button': 'onChangeOverdue',
      'click .save-task': 'onClickSave',
      'click .cancel': 'onClickCancel'
    },

    ui: {
      'customFrequency': '.custom-frequency',
      'deadlineBlock': '.deadline',
      'deadlineRulesBlock': '.deadline-rules',
      'completion': '.completion-button',
      'overdue': '.overdue-button',
      'iftttInstructions': '.ifttt-instructions',
    },

    initialize: function() {
      var user = window.app.user;

      this.uuid = this.options.uuid
      this.parent = this.options.parent

      this.small = user.get('small_amount');
      this.mid = user.get('mid_amount');
      this.large = user.get('large_amount');
    },

    onDomRefresh: function() {
      this.updateFrequencyUI();
      this.updateAmountUI();
      this.updateCompletionUI();
      this.updateOverdueUI();

      $('.ui.dropdown').dropdown();
    },

    onUpdateTitle: function(e) {
      this.model.set('title', $(e.target).val());
    },

    onChangeAmount: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass("small")) {
        this.model.set({
          amount: this.small
        });
      } else if ($(e.target).hasClass("mid")) {
        this.model.set({
          amount: this.mid
        });
      } else if ($(e.target).hasClass("large")) {
        this.model.set({
          amount: this.large
        });
      } else if ($(e.target).hasClass("custom")) {
        this.model.set({
          amount: null
        });
      }

      this.updateAmountUI();
    },

    updateAmountUI: function() {
      var amount = this.model.get('amount'),
          set_amount_to;

      if (amount == this.small) {
        set_amount_to = 'small';
      } else if (amount == this.mid) {
        set_amount_to = 'mid';
      } else if (amount == this.large) {
        set_amount_to = 'large';
      } else {
        set_amount_to = 'custom';
      }

      $(this.el).find('.amount-button').removeClass('primary');
      $(this.el).find('.amount-button.' + set_amount_to).addClass('primary');

      if (set_amount_to == 'custom') {
        // $(this.ui.customFrequency).show();
      } else {
        // $(this.ui.customFrequency).hide();
      }
    },

    onChangeFrequency: function(e) {
      e.preventDefault();

      if ($(e.target).hasClass('never')) {
        this.model.set({
          custom_interval:false,
          regenerate_on_completion: false,
          frequency: null,
          scale: null
        });
      } else if ($(e.target).hasClass('daily')) {
        this.model.set({
          custom_interval:false,
          frequency: 1,
          scale: 'day',
          regenerate_on_completion: false
        });
      } else if ($(e.target).hasClass('weekly')) {
        this.model.set({
          custom_interval:false,
          frequency: 1,
          scale: 'week',
          regenerate_on_completion: false
        });
      } else if ($(e.target).hasClass('completion')) {
        this.model.set({
          custom_interval:false,
          regenerate_on_completion: true,
          frequency: null,
          scale: null
        });
      } else if ($(e.target).hasClass('custom')) {
        this.model.set({
          custom_interval:true,
          regenerate_on_completion: false,
          frequency: null,
          scale: null
        });
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
      } else if ((freq && scale) || this.model.get('custom_interval')) {
        set_frequency_to = 'custom';
      } else {
        set_frequency_to = 'never';
      }

      $(this.el).find('.frequency-button').removeClass('primary');
      $(this.el).find('.frequency-button.' + set_frequency_to).addClass('primary');

      if (set_frequency_to == 'custom') {
        $(this.ui.customFrequency).show();
      } else {
        $(this.ui.customFrequency).hide();
      }

      if (set_frequency_to == 'never') {
        $(this.ui.deadlineRulesBlock).hide();
        $(this.ui.deadlineBlock).show();
      } else {
        $(this.ui.deadlineRulesBlock).show();
        $(this.ui.deadlineBlock).hide();
      }
    },

    onUpdateFrequency: function(e) {
      this.model.set('frequency', $(e.target).val());
    },

    onUpdateScale: function(e) {
      this.model.set('scale', $(e.target).val());
    },

    onChangeOverdue: function(e) {
      var $t = $(e.target);
      if ($t.hasClass('primary') || $t.closest('button').hasClass('primary')) {
        this.model.set({
          can_be_overdue: true
        });
      } else {
        this.model.set({
          can_be_overdue: false
        });
      }

      this.updateOverdueUI();
    },

    updateOverdueUI: function() {
      var can_be_overdue = this.model.get('can_be_overdue');

      if (can_be_overdue == true) {
        $(this.ui.overdue).removeClass('primary');
      } else {
        $(this.ui.overdue).addClass('primary');
      }
    },

    onChangeCompletion: function(e) {
      var $t = $(e.target);
      if ($t.hasClass('primary') || $t.closest('button').hasClass('primary')) {
        this.model.set({
          completable_by: 'Oyster'
        });
      } else {
        this.model.set({
          completable_by: 'IFTTT'
        });
      }

      this.updateCompletionUI();
    },

    updateCompletionUI: function() {
      var completable_by = this.model.get('completable_by');

      if (completable_by == 'IFTTT') {
        $(this.ui.completion).addClass('primary');
        $(this.ui.iftttInstructions).show();
      } else {
        $(this.ui.completion).removeClass('primary');
        $(this.ui.iftttInstructions).hide();
      }
    },

    onClickSave: function() {
      if (!this.model.get('uuid')) {
        // TODO: too kludgy, clean up
        this.model.set('temp_guid', this.uuid);
      }

      var promise = this.model.save();

      if (this.parent) {
        $.when(promise).done(_.bind(function() {
          this.parent.collection.add(this.model);
          this.parent.showBasicAdd();
        }, this));
      } else {
        // TODO: router not working correctly when "?" in URL
        window.app.router.navigate('checklist', true);
      }

    },

    onClickCancel: function(e) {
      e.preventDefault();
      if (this.parent) {
        this.parent.showBasicAdd();
      }
    }

  });
});