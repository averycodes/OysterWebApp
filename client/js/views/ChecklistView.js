/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'views/TaskView',
    'views/BasicAddItemView',
    'views/AdvancedAddItemView',
    'models/Task',
    'collections/TaskCollection'
], function (Marionette, templates, _, TaskView, BasicAddItemView,
            AdvancedAddItemView, Task, TaskCollection) {
    'use strict';

    return Marionette.CompositeView.extend({
        template: templates.checklist,
        className: 'checklist-view',
        childView: TaskView,
        itemViewContainer: '.checklist-items',

        initialize: function() {
            this.regionManager = new Marionette.RegionManager();
        },

        onDomRefresh: function() {
            this.addItemForm = this.regionManager.addRegion(
                "addItemForm", "#add-item-form"
            );
            this.showBasicAdd();
        },

        onClose: function() {
            this.regionManager.close();
        },

        addTaskWithReward: function(task, amount) {
            task = new Task({
                title: task,
                amount: amount,
                doable: true,
                is_credit: true
            });
            task.save();
            task.on("change", function(model, response) {
                this.collection.add(model);
            }, this);

            this.showBasicAdd();
        },

        showAdvancedAdd: function() {
            this.addItemForm.show(new AdvancedAddItemView({
                parent: this
            }));
        },

        showBasicAdd: function() {
            this.addItemForm.show(new BasicAddItemView({
                parent: this
            }));
        }
    });
});
