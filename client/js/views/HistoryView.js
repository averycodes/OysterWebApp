/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'views/HistoryItemView',
    'collections/HistoryCollection'
], function (Marionette, templates, _, HistoryItemView, HistoryCollection) {
    'use strict';

    return Marionette.CollectionView.extend({
        itemView: HistoryItemView,

        onShow: function() {
            this.trigger('nav:history');
        },

        initialize: function() {
            this.collection = new HistoryCollection();
            this.collection.fetch();
        },


        // template: templates.checklist,

        // ui: {
        //     header: 'h2'
        // },



    });
});
