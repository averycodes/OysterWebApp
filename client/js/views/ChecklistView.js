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
        itemView: TaskView,
        itemViewContainer: '.checklist-items',

        events: {
            'click .task-view': 'onClickTask'
        },

        initialize: function() {
            this.regionManager = new Marionette.RegionManager();
            this.collection = new TaskCollection();
            this.collection.fetch();
        },

        onDomRefresh: function() {
            this.addItemForm = this.regionManager.addRegion(
                "addItemForm", "#add-item-form"
            );
            this.showBasicAdd();
        },

        onRender: function() {
            // used to contain filter
        },

        onClose: function() {
            this.regionManager.close();
        },

        addTaskWithReward: function(task, reward) {
            task = new Task({
                title: task,
                reward: reward,
                doable: true
            });
            task.save();
            this.collection.add(task);

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
