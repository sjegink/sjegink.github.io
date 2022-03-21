"use strict";

// SEARCH-BOXES

$(document).ready(()=>{
	refreshSearchFooter({});
});
$(document).on('focus', '.x_search__input', ev=>{
	$('.x_search .x_search__row.is-active').removeClass("is-active");
	$(ev.target).parents('.x_search__row').addClass("is-active");
});
$(document).on('blur', '.x_search__input', ev=>{
	$(ev.target).parents('.x_search__row').removeClass("is-active");
});
$(document).on('keydown', ev=>{
	const VISUAL_KEYS = /[\u0020\u0030-\u0039\u0040-\u005a\u0060-\u0069\u006a\u006b\u006d-\u006f\u00ba-\u00c0\u00db-\u00de]/
	if($('.x_search__row.is-active').length==0){
		if(VISUAL_KEYS.test(String.fromCharCode(ev.keyCode))){
			$('.x_search__input').eq(0).focus();
		}
	}
});
$(document).on('keydown keyup', ev=>{
	if($('.x_search__row.is-active').length){
		refreshSearchFooter(ev);
	}
});
$(document).on('keydown', '.x_search__input', ev=>{
	const $inp = $(ev.target), $inps = $('.x_search__input');
	let seq;
	switch(ev.keyCode){
		case 13: // ENTER
			if(ev.shiftKey){
				goTranslationSearch($inp, ev.ctrlKey);
			}else{
				goIntegratedSearch($inp, ev.ctrlKey);
			}
			break;
		case 38:
			seq = $inps.index($inp);
			if(-1<--seq) $inps.eq(seq).focus();
			break;
		case 40:
			seq = $inps.index($inp);
			if(++seq<$inps.length) $inps.eq(seq).focus();
			break;
		default:
			// console.debug(`keyCode == ${ev.keyCode}`);
	}
});

function refreshSearchFooter(ev){
	const $xf = $('.x_search__footer_text');
	if(ev.shiftKey){
		$xf.text("[Shift] + [Enter] 키로 영어사전 검색을 실행합니다.");
	}else{
		$xf.text("[Enter] 키로 검색을 실행합니다.");
	}
}

function goIntegratedSearch($inp, isNewWindow){
	let keyword = $inp.val();
	let url = {
		naver: `https://search.naver.com/search.naver?query=$0`,
		google: `https://www.google.co.kr/search?q=$0`,
	}[$inp.parent().data('vendor')];
	url = url.replace('$0', encodeURIComponent(keyword));
	if(isNewWindow){
		window.open(url, '_blank');
	}else{
		location.href = url;
	}
};

function goTranslationSearch($inp, isNewWindow){
	let keyword = $inp.val();
	let url = {
		naver: `https://en.dict.naver.com/#/search?query=$0`,
		google: `https://translate.google.com/?sl=$1&tl=$2&text=$0&op=translate`,
	}[$inp.parent().data('vendor')];
	url = url.replace('$0', encodeURIComponent(keyword));
	if(/[ㄱ-ㅣ가-힣]/.test(keyword)){
		url = url.replace('$1', "ko").replace('$2', "en");
	}else{
		url = url.replace('$1', "en").replace('$2', "ko");
	}
	if(isNewWindow){
		window.open(url, '_blank');
	}else{
		location.href = url;
	}
};