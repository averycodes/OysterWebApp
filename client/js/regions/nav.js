define([
    'app',
    'marionette'
], function(app, Marionette){

    return  Marionette.Region.extend({
        ui: {
            history: '.history',
            wishlist: '.wishlist',
            checklist: '.checklist'
        },

        deactivateEverything: function() {
            $(this.el).find('li').removeClass('active');
        },

        activateChecklist: function() {
            this.deactivateEverything();
            $(this.ui.checklist).addClass('active');
        },

        activateWishlist: function() {
            this.deactivateEverything();
            $(this.ui.wishlist).addClass('active');
        },

        activateHistory: function() {
            this.deactivateEverything();
            $(this.ui.history).addClass('active');
        }
    });

});

