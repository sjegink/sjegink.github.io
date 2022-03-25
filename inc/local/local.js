"use strict";

$(window).on('focus', ev=>{
	$('body').removeClass("is-inactive");
});
$(window).on('blur', ev=>{
	$('body').addClass("is-inactive");
});