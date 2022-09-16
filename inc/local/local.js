"use strict";
window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

$(window).on('focus', ev=>{
	$('body').removeClass("is-inactive");
});
$(window).on('blur', ev=>{
	$('body').addClass("is-inactive");
});