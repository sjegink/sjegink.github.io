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
				this.applyForQwerty(ev);
			})
			.on('focus change keydown keyup paste', '.x_search__input', ev=>{
				this._checkValueChange(ev);
			})
			.on('blur', '.x_search__input', ev=>{
				this.attachTooltipForQwerty(null);
			});
	}

	_draw(){
		const $section = $('<section>').addClass("x_search  my-auto d-flex flex-column py-1").html(`
			<header class="x_search__title  mx-auto py-1">Search for your own ideas!</header>
			<main class="x_search__body  mx-auto py-1">
				<div class="x_search__row  d-flex py-1" data-vendor="naver">
					<a class="x_search__logo  mx-1" tabindex="-1" href="https://www.naver.com"
						aria-label="네이버"></a>
					<input class="x_search__input"
						aria-label="네이버 검색어 입력"/>
				</div>
				<div class="x_search__row  d-flex py-1" data-vendor="google">
					<a class="x_search__logo  mx-1" tabindex="-1" href="https://www.google.com"
						aria-label="구글"></a>
					<input class="x_search__input"
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

	onValueChange($inp, valueBefore, valueAfter){
		if(/[a-z가-힣ㄱ-ㅣ]/i.test(valueAfter)){
			this.attachTooltipForQwerty($inp);
		}else{
			this.attachTooltipForQwerty(nul);
		}
	};

	attachTooltipForQwerty($inp){
		const className = "x_search__tooltip";
		const $tooltip = $(`.${className}`).length ?
			$(`.${className}`) :
			$('<div>').addClass(className);
		$tooltip.children().remove();
		if(!(($inp||null) instanceof jQuery)){
			return;
		}
		const display = this._valueInputToDisplayString($inp);
			
		$tooltip.appendTo($inp.parent()).html(`
			<div class="x_search__tooltip-visual d-flex">
				<img class="x_search__tooltip-keyicon" src="./res/fg/keyboard_item_esc.svg">
				<div class="x_search__tooltip-text">${display}</div>
			</div>
		`);
	};

	applyForQwerty(ev){
		const $inp = $(ev.target);
		if(ev.keyCode==27 && $inp.data('value-state')==="1"){
			$inp.val(this._valueInputToDisplayString($inp));
			const VI = $inp.data('value-input').match(/../g);
			VI.forEach((pair,i)=>{
				if(pair[0]) VI[i] = (3-Number(pair[0])) + pair[1];
			});
			$inp.data('value-input', VI.join(""));
			this.attachTooltipForQwerty($inp);
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
		function writeFooter(keyLabels, strs){
			const spans = [];
			keyLabels.map((keyLabel,i)=>{
				if(i) spans.push($('<span>').text("+ "));
				spans.push($('<span>').text(`[${keyLabel}] `).css({'color':"#07B"}));
			});
			strs.map((str,i)=>{
				spans.push($('<span>').text(str).addClass(i%2 ? "accent": ""));
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

	_checkValueChange__evQueue = [];
	_checkValueChange(ev){
		const KEY_TYPE = { KO:2, EN:1, ETC:0 };
		console.log(ev);
		if(ev != null){
			const $inp = $(ev.target);
			if(!$inp.val()){
				$inp.data('value-before', "");
				$inp.data('value-input', "");
				$inp.data('value-state', null);
				this.attachTooltipForQwerty(null);
			}
			console.log('♣ TRIGGED', $inp.val(), $inp.data('value-before'), $inp.data('value-input'), $inp.data('value-state'));
			clearTimeout(this._checkValueChange__asyncReserved);
			this._checkValueChange__evQueue.push(ev);
			ev.value = ev;
			this._checkValueChange__asyncReserved = setTimeout(()=>this._checkValueChange(null),10);
			return;
		}
		if(!this._checkValueChange__evQueue.length){
			$inp.data('value-input', "");
			$inp.data('value-state', null);
			this.attachTooltipForQwerty(null);
		}else while(ev = this._checkValueChange__evQueue.shift()){
			const $inp = $(ev.target);
			const valueBefore = $inp.data('value-before');
			console.log('♣ RECALLED', $inp.val(), $inp.data('value-before'), $inp.data('value-input'), $inp.data('value-state'));
			if(!valueBefore) $inp.data('value-input', "");
			const valueAfter = $inp.val();
			if(!valueAfter){
				$inp.data('value-input', "");
				$inp.data('value-state', null);
				this.attachTooltipForQwerty(null);
			}else if($inp.data('value-state')==="-1"){
				// value state = 0:빈칸 / 1:내용있음(빈칸에서앞만보고달려옴) / -1:역방향감지(유저가_상황인식했을거라)
			}else{
				const KEYS = { BS:0x08, ESC:0x1b, HOME:0x23,END:0x24, LF:0x25,UP:0x26,RT:0x27,DN:0x28 };
				const KEYS_DISALLOWED = (({ESC,HOME,END,LF,UP,RT,DN})=>({ESC,HOME,END,LF,UP,RT,DN}))(KEYS); // those make assistant be disabled
				let isValid = true;
				let isChanged = valueBefore!==valueAfter;
				isValid &= /^key/.test(ev.type) && !Object.values(KEYS_DISALLOWED).includes(ev.keyCode);
				isValid &= ev.type!='change' || !isChanged;
				if(!isValid){
					$inp.data('value-state', "-1");
					this.attachTooltipForQwerty(null);
					return;
				}
				$inp.data('value-state', "1");
				if(ev.keyCode===KEYS.BS && valueBefore){
					let lengthShorter = valueBefore.length<valueAfter.length ? valueBefore.length : valueAfter.length;
					let lengthCorrect;
					for(let i=0; i<lengthShorter; i++){
						lengthCorrect = i;
						if(valueBefore.charAt(i) !== valueAfter.charAt(i)) break;
					}
					if(valueAfter.length < valueBefore.length){
						const VAL_INPUT_AFTER = KorUtil.qwerty(valueAfter);
						const LEN_INPUT_AFTER = VAL_INPUT_AFTER.length;
						const LEN_INPUT_SHORTER = KorUtil.qwerty(valueBefore.substring(0, lengthShorter)).length;
						const LEN_DATA_SHORTER = LEN_INPUT_SHORTER * 2;
						let data = $inp.data('value-input');
						data = data.substring(0, LEN_DATA_SHORTER);
						let lastChar = valueAfter.replace(/[^가-힣ㄱ-ㅣa-z]*$/i,"").substr(-1);
						let isLastKorean = KorUtil.isKorean(valueAfter.substr(-1));
						let lastKeyType = /[a-z]/i.test(lastChar) ? KEY_TYPE.EN: isLastKorean ? KEY_TYPE.KO : KEY_TYPE.ETC;
						lastChar = KorUtil.qwerty(lastChar).substr(-1)[ev.shiftKey?'toUpperCase':'toLowerCase']();
						for(let i=LEN_INPUT_SHORTER; i<LEN_INPUT_AFTER; i++){
							data += lastKeyType;
							data += VAL_INPUT_AFTER.charAt(i)[ev.shiftKey?'toUpperCase':'toLowerCase']();
							// Frankly, this speculation about IME modes is nonsense.
							// But, probably, this logic will be executed with only one input.
							// Therefore, No problem is expected.
						}
						$inp.data('value-before', valueAfter);
						$inp.data('value-input', data);
						this.onValueChange($inp, valueBefore, valueAfter);
					}else{
						// Infact, Users RARELY can make various key inputs be accumulated before this be executed.
						// So, valueAfter must be shorter than valueBefore.
						ev.keyCode = null;
					}
				}
				if(ev.keyCode!==KEYS.BS && isChanged){
					let lastChar = valueAfter.substr(-1);
					let isLastKorean = KorUtil.isKorean(valueAfter.substr(-1));
					let lastKeyType = /[a-z]/i.test(lastChar) ? KEY_TYPE.EN: isLastKorean ? KEY_TYPE.KO : KEY_TYPE.ETC;
					lastChar = KorUtil.qwerty(lastChar).substr(-1)[ev.shiftKey?'toUpperCase':'toLowerCase']();
					$inp.data('value-before', valueAfter);
					$inp.data('value-input', ($inp.data('value-input')||"") + [
						lastKeyType,
						lastChar,
					].join(""));
					this.onValueChange($inp, valueBefore, valueAfter);
				}
			}
		};
	};

	_valueInputToDisplayString($inp){
		let display = "", koStack = "";
		($inp.data('value-input')||"").match(/../g).forEach(([type,char])=>{
			if(type==1){
				koStack += char;
			}else{
				if(koStack){
					display += KorUtil.koreanify(koStack);
					koStack = "";
				}
				display += char;
			}
		});
		if(koStack){
			display += KorUtil.koreanify(koStack);
		}
		return display;
	};
};