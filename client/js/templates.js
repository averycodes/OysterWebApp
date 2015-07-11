/*global define */

define(function (require) {
	'use strict';

	return {
        checklist: require('tpl!templates/checklist.html'),
        task: require('tpl!templates/task.html'),
        wish: require('tpl!templates/wish.html'),
        advancedadditem: require('tpl!templates/advancedadditem.html'),
        basicadditem: require('tpl!templates/basicadditem.html'),
        taskcompletion: require('tpl!templates/taskcompletion.html'),
        piggybank: require('tpl!templates/piggy_bank.html'),
	history: require('tpl!templates/history.html')
	};
});

