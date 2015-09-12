/*global define */

define([
    'backbone'
], function (Backbone) {
    'use strict';

    return Backbone.Model.extend({
        url: function() {
            if (this.id) {
                return '/api/v1/rules/' + this.id + '/';
            } else {
                return '/api/v1/rules/';
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

