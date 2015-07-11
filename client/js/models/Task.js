/*global define */

define([
    'backbone'
], function (Backbone) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            title: 'Task Title',
            doable: true,
            reward: 1,
            completed: false
        },

        url: function() {
            if (this.id) {
                return '/api/v1/tasks/' + this.id + '/';
            } else {
                return '/api/v1/tasks/';
            }
        },

        sync: function (method, model, options) {
            var csrftoken = Cookies.get('csrftoken');
            options.beforeSend = function(xhr){
              xhr.setRequestHeader('X-CSRFToken', csrftoken);
            };
            Backbone.sync.call(this, method, model, options);
        }


    });
});

