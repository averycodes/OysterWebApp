/*global define */

define([
    'marionette',
    'templates'
], function (Marionette, templates) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.basicadditem,

        ui: {
            input: '.new-task'
        },

        events: {
            'click .add-item': 'onClickAddItem',
            'click .advanced-options': 'onClickAdvancedOptions',
            'keypress .new-task': 'onSubmitInput'
        },

        initialize: function(options) {
            this.parent = this.options.parent;
        },

        onDomRefresh: function() {
            $(this.ui.input).focus();
        },

        onClickAddItem: function(e) {
            e.preventDefault();

            var $target = $(e.target),
                task, reward,
                $input = $(this.ui.input);

            if ($target.hasClass('small-reward')) {
                reward = 1;
            } else if ($target.hasClass('mid-reward')) {
                reward = 5;
            } else if ($target.hasClass('large-reward')) {
                reward = 10;
            }

            this.parent.addTaskWithReward($input.val(), reward);
        },

        onSubmitInput: function(e) {
            if (e.which === 13) {
                var $input = $(this.ui.input);
                this.parent.addTaskWithReward($input.val(), 1);
            }
        },

        onClickAdvancedOptions: function(e) {
            e.preventDefault();
            this.parent.showAdvancedAdd();
        }
    });
});
