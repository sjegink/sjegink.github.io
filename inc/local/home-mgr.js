"use strict";

const ATTR_INDEXER = "d-index";

window.homeMgr = new class HomeManager{
	constructor(){
		$(document)
			.ready(()=>{
				this._draw();
				this._refresh();
			})
	}

	_draw(){
		// section > div.space(perspective) > div.face
		const $x = $($('section')[0] || $('<section>'));
		$x.addClass("m-auto").appendTo($('body'));
		$x.children().remove();
		// space
		const $s = $('<div>').addClass("space").appendTo($x);
		// face-display
		$('<div>').addClass("face f_dp").appendTo($s);
		"012:34'56.789".match(/./g).forEach((v,i)=>this._drawChar(i,v));
	}

	_refresh(){
		const dt = new Date();
		const h = dt.getHours(), H = String(h).padStart(2,0);
		const m = dt.getMinutes(), M = String(m).padStart(2,0);
		const s = dt.getSeconds(), S = String(s).padStart(2,0);
		const l = dt.getMilliseconds(), L = String(l).padStart(3,0);
		const halfFlag = Math.floor(l/500)%2, qtFlag = Math.floor(l/250)%2, octFlag = Math.floor(l/125)%2;
		`${'ap'[Math.floor(h/12)]}${H}${halfFlag?" ":":"}${M}${qtFlag?" ":"'"}${S}${octFlag?" ":"'"}${L}`.match(/./g).forEach((v,i)=>this._drawChar(i,v));
		const minDelay=10, maxDelay=100;
		setTimeout(()=>this._refresh(), Math.floor(minDelay+Math.random()*(maxDelay-minDelay)));
	}

	_drawChar(i,v){
		const AttrName = "d-index";
		const $d = $($(`div[${AttrName}="${i}"]`)[0] || $('<div>').attr(AttrName, i).append((
			v===":" ? [
				[null,'-', "vertical"],
				[null,'+', "vertical"],
			]:
			v==="'" ? [
				[null,'-', "vertical"],
			]:
			v==="." ? [
				[null,'+', "vertical"],
			]:
			[
				['0','-', "horizontal"],
				['-','-',	"vertical"],
				['+','-',	"vertical"],
				['0','0', "horizontal"],
				['-','+',	"vertical"],
				['+','+',	"vertical"],
				['0','+', "horizontal"],
			]
		).map(args=>createSpan(...args))).appendTo($('.face.f_dp')));
		let n = Object.assign({
			' ': 0b0000000,
			'-': 0b0001000,
			'a': 0b0111111,
			'p': 0b0011111,
		},[
			0b1110111,
			0b0100100,
			0b1011101,
			0b1101101,
			0b0101110,
			0b1101011,
			0b1111011,
			0b0100101,
			0b1111111,
			0b1101111,
		])[v.toLowerCase()];
		if(n==null) n = v ? 0b11 : 0;
		let $ss = $d.children();
		for(let i=0; i<$ss.length; i++){
			$ss.eq(i)[n%2?'addClass':'removeClass']("is-active");
			n >>= 1;
		}
		return $d;
		function createSpan(x,y,t){ return $('<span>').attr({
			'stroke-x': x,
			'stroke-y': y,
			'stroke-type': t,
		}); }
	}
};