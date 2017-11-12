
var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom/react-dom.min.js');

var EL = document.getElementById("main-global-popover");

var Popover = {
	$el: EL,
	$init() {
		this.hide();
	},
	hide() {
		ReactDOM.render(<span />, this.$el);
		$(this.$el).css("display", "none");
	},
	show() {
		$(this.$el).css("display", "block");
	},

	render(element, target) {
		ReactDOM.render(element, this.$el);
		this.show();
		var top, left,
			targetRect = target.getBoundingClientRect(),
			rect = this.$el.getBoundingClientRect();
		top = targetRect.bottom+1;
		left = targetRect.right-rect.width-1;
		$(this.$el).css("top", top).css("left", left);
	},

};

$(function() {
	Popover.$init();
});

module.exports = Popover;
