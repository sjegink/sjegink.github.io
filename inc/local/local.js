"use strict";

$(window).on('focus', ev=>{
	$('body').removeClass("is-inactive");
});
$(window).on('blur', ev=>{
	$('body').addClass("is-inactive");
});

// SEARCH-BOXES

const searchBoxMgr = new class SearchBoxManager{
	constructor(){
		$(document)
			.ready(()=>{
				this._refreshFooter({});
			})
			.on('focus', '.x_search__input', ev=>{
				// input-box active sign
				this._setInputBoxActiveSign($(ev.target));
			})
			.on('blur', '.x_search__input', ev=>{
				// input-box active sign
				this._setInputBoxActiveSign(null);
			})
			.on('keydown', ev=>{
				if(this._getActiveInputBox()==null){
					if(this._isVisualKey(ev.keyCode)){
						this._setInputBoxFocus(0);
					}
				}
			})
			.on('keydown keyup', ev=>{
				// footer change
				if(this._getActiveInputBox()){
					this._refreshFooter(ev);
				}
			})
			.on('keydown', '.x_search__input', ev=>{
				// key-input process in input-box
				const $inp = $(ev.target), $inps = $('.x_search__input');
				let seq;
				switch(ev.keyCode){
					case 13: // ENTER
						if(ev.shiftKey){
							this.goTranslationSearch($inp, ev.ctrlKey);
						}else{
							this.goIntegratedSearch($inp, ev.ctrlKey);
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
	}

	goIntegratedSearch($inp, isNewWindow){
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

	goTranslationSearch($inp, isNewWindow){
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

	// below: private methods //

	_getActiveInputBox(){
		const $row = $('.x_search__row.is-active');
		return $row.length ?
			$row.children('.x_search__input') :
			null;
	}
	_setInputBoxFocus(seq){
		$('.x_search__input').eq(seq).focus();
	}
	_setInputBoxActiveSign($input){
		const $row = $input instanceof jQuery ? $input.parents('.x_search__row') : null;
		if($row) $row.addClass("is-active");
		$('.x_search .x_search__row.is-active').not($row).removeClass("is-active");
	}
	_isVisualKey(keyCode){
		const VISUAL_KEYS = /[\u0020\u0030-\u0039\u0040-\u005a\u0060-\u0069\u006a\u006b\u006d-\u006f\u00ba-\u00c0\u00db-\u00de]/
		return VISUAL_KEYS.test(String.fromCharCode(keyCode))
	}

	_refreshFooter(ev){
		ev = ev || {};
		function writeFooter(keyLabels, strs){
			const spans = [];
			keyLabels.map((keyLabel,i)=>{
				if(i) spans.push($('<span>').text("+ "));
				spans.push($('<span>').text(`[${keyLabel}] `).css({'color':"#07B"}));
			});
			strs.map((str,i)=>{
				spans.push($('<span>').text(str).css(i%2 ? {
					'font-weight': "bolder",
					'filter': "brightness(0)",
				}:{}));
			});
			$('.x_search__footer_text').html("").append(spans);
		}
		switch(0
			+( ev.ctrlKey ? 0b10 : 0)
			+( ev.shiftKey ? 0b01 : 0)
		){
			case 0b00:
				return writeFooter([
					'Enter',
				],[
					"키로 ",
					"웹 ",
					"검색",
				]);
			case 0b01:
				return writeFooter([
					'Shift', 'Enter',
				],[
					"키로 ",
					"영어사전 ",
					"검색",
				]);
			case 0b10:
				return writeFooter([
					'Ctrl', 'Enter',
				],[
					"키로 ",
					"새 창",
					"에서 ",
					"웹 ",
					"검색",
				]);
			case 0b11:
				return writeFooter([
					'Ctrl', 'Shift', 'Enter',
				],[
					"키로 ",
					"새 창",
					"에서 ",
					"영어사전 ",
					"검색",
				]);
		}
	};
};