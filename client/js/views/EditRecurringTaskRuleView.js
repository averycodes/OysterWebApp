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
      'blur .amount': 'onUpdateAmount',
      'change .scale': 'onUpdateScale',
      'change .period-dropdown': 'onSelectPeriod',
      'click .completion-button': 'onChangeCompletion',
      'click .save-task': 'onClickSave',
      'click .cancel': 'onClickCancel',
    },

    ui: {
      'customFrequency': '.custom-frequency',
      'customAmount': '.custom-amount',
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
    },

    onDomRefresh: function() {
      this.updatePeriodUI();
      this.updateCompletionUI();

      $('.ui.dropdown').dropdown();
    },

    onUpdateTitle: function(e) {
      this.model.set('title', $(e.target).val());
    },

    onUpdateAmount: function(e) {
      this.model.set('amount', $(e.target).val());
    },

    onSelectPeriod: function(e) {
      e.preventDefault();

      var val = $(e.target).val();

      if (val == 'never') {
        this.model.set({
          custom_interval:false,
          regenerate_on_completion: false,
          frequency: null,
          scale: null
        });
      } else if (val == 'daily') {
        this.model.set({
          custom_interval:false,
          frequency: 1,
          scale: 'day',
          regenerate_on_completion: false
        });
      } else if (val == 'weekly') {
        this.model.set({
          custom_interval:false,
          frequency: 1,
          scale: 'week',
          regenerate_on_completion: false
        });
      } else if (val == 'completion') {
        this.model.set({
          custom_interval:false,
          regenerate_on_completion: true,
          frequency: null,
          scale: null
        });
      } else if (val == 'custom') {
        this.model.set({
          custom_interval:true,
          regenerate_on_completion: false,
          frequency: null,
          scale: null
        });
      }

      this.updatePeriodUI();
    },

    updatePeriodUI: function() {
      var freq = this.model.get('frequency'),
          scale = this.model.get('scale'),
          completion = this.model.get('regenerate_on_completion'),
          set_period_to;

      if (freq == 1 && scale == 'day') {
        set_period_to = 'daily';
      } else if (freq == 1 && scale == 'week') {
        set_period_to = 'weekly';
      } else if (completion) {
        set_period_to = 'completion';
      } else if ((freq && scale) || this.model.get('custom_interval')) {
        set_period_to = 'custom';
      } else {
        set_period_to = 'never';
      }

      $(this.el).find('.period-dropdown').val(set_period_to);

      if (set_period_to == 'custom') {
        $(this.ui.customFrequency).show();
      } else {
        $(this.ui.customFrequency).hide();
      }

      if (set_period_to == 'never') {
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

    onChangeCompletion: function(e) {
      e.preventDefault();

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