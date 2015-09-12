define([
    'app',
    'marionette'
], function(app, Marionette){

    return  Marionette.Region.extend({
        ui: {
            history: '.history-nav',
            wishlist: '.wishlist-nav',
            checklist: '.checklist-nav',
            recurring: '.recurring-nav'
        },

        deactivateEverything: function() {
            $(this.el).find('a').removeClass('active');
        },

        activateChecklist: function() {
            this.deactivateEverything();
            $(this.ui.checklist).addClass('active');
        },

        activateWishlist: function() {
            this.deactivateEverything();
            $(this.ui.wishlist).addClass('active');
        },

        activateRecurring: function() {
            this.deactivateEverything();
            $(this.ui.recurring).addClass('active');
        },

        activateHistory: function() {
            this.deactivateEverything();
            $(this.ui.history).addClass('active');
        }
    });

});

