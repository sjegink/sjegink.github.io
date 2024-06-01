"use strict";

window.searchBoxMgr = new class SearchBoxManager{
	constructor(){
		$(document)
			.ready(()=>{
				this._draw();
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
					if(ev.keyCode==191){
						// slash(/) means Google!
						this._setInputBoxFocus(1);
						ev.preventDefault();
					}else
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
			})
			.on('keydown', '.x_search__input', ev=>{
				if(isMobile) return;
				if(ev.ctrlKey && ev.keyCode===32){
					ev.preventDefault()
					this.applyForQwerty($(ev.target), ev);
				}
			})
	}

	_draw(){
		const $section = $('<section>').addClass("x_search  my-auto d-flex flex-column py-1").html(`
			<header class="x_search__title  mx-auto py-1">Search for your own ideas!</header>
			<main class="x_search__body  mx-auto py-1">
				<div class="x_search__row  d-flex py-1" data-vendor="naver">
					<a class="x_search__logo  mx-1" tabindex="-1" href="https://www.naver.com"
						aria-label="네이버"></a>
					<input class="x_search__input" type="search"
						aria-label="네이버 검색어 입력"/>
				</div>
				<div class="x_search__row  d-flex py-1" data-vendor="google">
					<a class="x_search__logo  mx-1" tabindex="-1" href="https://www.google.com"
						aria-label="구글"></a>
					<input class="x_search__input" type="search"
						aria-label="구글 검색어 입력"/>
				</div>
			</main>
			<footer class="x_search__footer py-1">
				<p class="x_search__footer_text  m-0 text-center"></p>
			</footer>
		`);
		$('body').children('section').remove();
		$('body').prepend($section);
	};

	applyForQwerty($inp, ev){
		let {selectionStart:bPos,selectionEnd:ePos} = $inp[0];
		let str = $inp.val().substring(bPos,ePos);
		if(bPos===ePos){
			str = $inp.val().substring(0, ePos);
		}
		const lastIndexOfEn = str.match(/[a-z][^a-z]*$/)?.index ?? -1
		const lastIndexOfKo = str.match(/[가-힣ㄱ-ㅣ][^가-힣ㄱ-ㅣ]*$/)?.index ?? -1
		if(lastIndexOfEn === lastIndexOfKo){ // 같다는 건, 둘 다-1이라는 뜻
			return;
		}
		if(lastIndexOfEn < lastIndexOfKo){ // 한글이 더 뒤에 있으면, 한글을 영어로
			if(bPos===ePos){
				// 직접 범위를 지정하지 않은 경우, 영어 부분은 이미 인지하고 입력했다고 판단하여 제외
				str = str.replace(/^.*[a-z]/,'');
				bPos = ePos - str.length;
			}
			let result = KorUtil.qwerty(str);
			$inp.val($inp.val().substring(0, bPos) + result + $inp.val().substring(ePos));
			if(str !== result){
				$inp[0].setSelectionRange(bPos, ePos - str.length + result.length)
			}
		}
		if(lastIndexOfKo < lastIndexOfEn){ // 영어가 더 뒤에 있으면, 영어를 한글로
			if(bPos===ePos){
				// 직접 범위를 지정하지 않은 경우, 한글 부분은 이미 인지하고 입력했다고 판단하여 제외
				str = str.replace(/^.*[가-힣ㄱ-ㅣ]/,'')
				bPos = ePos - str.length
			}
			let result = KorUtil.koreanify(str);
			$inp.val($inp.val().substring(0, bPos) + result + $inp.val().substring(ePos));
			if(str !== result){
				$inp[0].setSelectionRange(bPos, ePos - str.length + result.length)
			}
		}
		
		return
		if(ev.keyCode==27){ // TODO 발동조건
			$inp.val(this._valueInputToDisplayString($inp)); // TODO 변환처리
			ev.preventDefault();
			ev.stopImmediatePropagation();
		}
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
		const VENDOR_NAME = $inp.parent().data('vendor');
		const urlByVendor = {
			_naver: `https://en.dict.naver.com/`,
			naver: `https://en.dict.naver.com/#/search?query=$0`,
			google: `https://translate.google.com/?sl=$1&tl=$2&text=$0&op=translate`,
		};
		let url = urlByVendor[VENDOR_NAME].replace('$0', encodeURIComponent(keyword));
		if(!keyword && VENDOR_NAME=="naver"){
			url = urlByVendor._naver;
		}else if(/[ㄱ-ㅣ가-힣]/.test(keyword)){
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
		function writeFooters(...$elementsList){
			$('.x_search__footer_text').html("");
			$elementsList.forEach($elements=>{
				$('.x_search__footer_text').append($elements).append('<br>');
			});
		}
		function buildFooterElements(keyLabels, strs){
			const spans = [];
			keyLabels.map((keyLabel,i)=>{
				if(i) spans.push($('<span>').text("+ "));
				spans.push($('<span>').text(`[${keyLabel}] `).css({'color':"#07B"}));
			});
			strs.map((str,i)=>{
				spans.push($('<span>').text(str).addClass(i%2 ? "accent": ""));
			});
			return spans;
		}
		switch(0
			+( ev.ctrlKey ? 0b10 : 0)
			+( ev.shiftKey ? 0b01 : 0)
		){
			case 0b00:
				return writeFooters(buildFooterElements([
					'Enter',
				],[
					"키로 ",
					"웹 ",
					"검색",
				]));
			case 0b01:
				return writeFooters(buildFooterElements([
					'Shift', 'Enter',
				],[
					"키로 ",
					"영어사전 ",
					"검색",
				]));
			case 0b10:
				return writeFooters(
					buildFooterElements([
						'Ctrl', 'Enter',
					],[
						"키로 ",
						"새 창",
						"에서 ",
						"웹 ",
						"검색",
					]),
					buildFooterElements([
						'Ctrl', 'Space',
					],[
						"키로 ",
						"한타-영타 ",
						"변환",
					]),
				);
			case 0b11:
				return writeFooters(buildFooterElements([
					'Ctrl', 'Shift', 'Enter',
				],[
					"키로 ",
					"새 창",
					"에서 ",
					"영어사전 ",
					"검색",
				]));
		}
	};
};