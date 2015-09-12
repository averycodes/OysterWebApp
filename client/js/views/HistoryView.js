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
        childView: HistoryItemView,
        tagName: 'ul',
        className: 'table-view',

        onShow: function() {
            this.trigger('nav:history');
        },

        initialize: function() {
            this.collection = new HistoryCollection();
            this.collection.fetch();
        },

    });
});
