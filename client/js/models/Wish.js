/*global define */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {
    'use strict';

    return Backbone.Model.extend({
        blacklist: ['created', 'updated', 'image'],

        toJSON: function(options) {
            return _.omit(this.attributes, this.blacklist);
        },

        url: function() {
            if (this.id) {
                return '/api/v1/wishes/' + this.id + '/';
            } else {
                return '/api/v1/wishes/';
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

