"use strict";

window.sudokuMgr = new class SudokuManager{

	_map;

	constructor(){
		$(document)
			.ready(async ()=>{
				this._clear();
				await this.generate(3);
				this._draw();
			})
	}

	_clear(){
		const $main = $('<main>').addClass("my-auto d-flex").append([
			$('<section>').addClass("x_board  mx-auto d-flex flex-wrap"),
		]);
		$('body').append($main).children('main').not($main).remove();
	}
	_draw(){
		const $board = $('section').eq(0);
		$board.children().remove();
		const boxSize = (100 / this._map.length - .001).toFixed(3) + '%';
		let ox,oy, ix,iy;
		for(oy=0; oy<this._map.length; oy++){
			for(ox=0; ox<this._map.length; ox++){
				const $box = $('<div>').addClass("box  d-flex flex-wrap").attr({
					'data-y': oy,
					'data-x': ox,
				}).appendTo($('<div>').css({
					width: boxSize,
					height: boxSize,
				}).appendTo($board));
				for(iy=0; iy<this._map.length; iy++){
					for(ix=0; ix<this._map.length; ix++){
						const $cell = $('<div>').addClass("cell  d-flex").attr({
							'data-y': iy,
							'data-x': ix,
						}).appendTo($('<div>').css({
							width: boxSize,
							height: boxSize,
						}).appendTo($box));
						const value = this._map[oy][ox][iy][ix];
						if(value!=null){
							$cell.text(value);
						}
					}
				}
			}
		}
	}

	async generate(size){
		const radix = Math.pow(size,2);
		// define candidate characters
		const chars = new Array(radix).fill('\0').map((_,i)=>i.toString(36));
		if(radix < 10){
			chars.shift();
			chars.push(radix);
		}
		// create storage
		const _build = fill=>new Array(size).fill(0).map(fill);
		let ox,oy, ix,iy;
		// generate full
		const presets = {
			4: [
				"0123456789abcdef9a451bc87def2036bfe6d92a013c48578d7c3ef0425619ab3a79bc84def05216c2f039a14567e8dbe564fd7082b19ac3b18d562e9ac3704f6395afb814cd270eb40ad17c5f2e6389c78d230e6ba914f5ef1264950738cbda7bd1e04a9652f83cae52f6938cb4071d30985c127edfa64bfc64d8b7a30125e9",
				"0123456789abcdef5fbc81de0236a97446a8f9207ecd51b37ed9a3bcf1450862def41ab058329c76b019e7c84a6d235fc27ad365ebf98041658392f4c071baed6758ab49e2cdf301c4fad8013b956e270d92375e6a1fb48c1b3e2fc64708d95a7f1e20dab485369c958b76431ca0fde2acd495eb2f36180736208c1fed9754ab",
				"0123456789abcdefb5cf28d3e7069a418649eabcd5f102377adef091c432586b978162b53acdef04dfab091c462e537823c4ad8ef705916b65e03f471b89ac2da3f2104658de7b9ccbe9f28da4671035105679eabc234fd88d74b3c5091fe2a6fe18bc3ad45026793cb06d927efa8154649d5e7fc8123ba0275a410896b3defc",
				"0123456789abcdefafb89c13d07e452696cedf801245a37b745dabe23c6f8901ae9c387d5046f2b1f18bc2e937ad046504d2fa5689b17ce35376b014cf2e98dad7856f19b3cae402b60aedc728f45391e19c25346d07b8fa42f30a8be1956dc776fe1a502bd49c38193c6b4f8e507ad240adce2837195b6f25b8d739f6ac1e40",
			],
		}[size];
		if(presets && presets.length){
			const presetValues = presets[Math.floor(Math.random()*presets.length)].split("");
			this._map = _build(()=>_build(()=>_build(()=>_build(()=>presetValues.shift()))));
		}else{
			this._map = _build(()=>_build(()=>_build(()=>_build(()=>null))));
			for(iy=0; iy<size; iy++) for(ix=0; ix<size; ix++){
				this._map[0][0][iy][ix] = chars[iy*size + ix];
			}
			const seeds = JSON.parse(JSON.stringify(this._map));
			const _backward = ()=>{
				if(--ix < 0){
					ix += size;
					if(--iy < 0){
						iy += size;
						if(--ox < 0){
							ox += size;
							oy--;
						}
					}
				}
			};
			const _verify = (val, ...args)=>{
				if(val===false){
					return val;
				}
				let y1,x1,y2,x2;
				for(let i=0,j; i<size; i++) for(j=0; j<size; j++){
					[y1,x1,y2,x2] = args.map(x=>String(x)).join("\t").replace('null', i).replace('null',j).split("\t").map(v=>parseInt(v));
					if(y1==oy && y2==iy && x1==ox && x2==ix) continue;
					if(val===this._map[y1][x1][y2][x2]){
						return false;
					}
				}
				return val;
			};
			const logs = [];
			let loopCount = 0;
			const loopLimit = Math.pow(radix, 4) * 6;
// const loopLimit = NaN;
			for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++) for(iy=0; iy<size; iy++) for(ix=0; ix<size; ix++){
				if(oy+ox==0) continue;
				if(loopLimit <= ++loopCount) throw new Error(`LOOP LIMIT (${loopLimit})`);
				let val;
				if(seeds[oy][ox][iy][ix] == null){
					// 시드 없는 셀 = 이제 막 개척하려는 중
					val = chars[Math.floor(Math.random() * radix)];
					seeds[oy][ox][iy][ix] = val;
					this._map[oy][ox][iy][ix] = val;
				}else{
					// 시드 있는 셀 = 다음 셀에서 '모순' 걸려서 되돌아왔음 => 다음값 선정
					let idx = chars.indexOf(this._map[oy][ox][iy][ix]);
					idx = (idx + 1) % radix;
					val = chars[idx];
					this._map[oy][ox][iy][ix] = val;
					// 시드와 겹침 = 한 바퀴 다 돌았는데 가능한 값이 없음 = '모순' => 이전 셀을 바꿔야 함
					if(val === seeds[oy][ox][iy][ix]){
						this._map[oy][ox][iy][ix] = null;
						seeds[oy][ox][iy][ix] = null;
						_backward(--ix);
						continue;
					}
				}
				// 검증
				val = _verify(val, oy,ox,null,null); // 박스 내에서 중복검사
				val = _verify(val, null,ox,null,ix); // 세로 줄에서 중복검사
				val = _verify(val, oy,null,iy,null); // 가로 줄에서 중복검사
				// logs.push(`[${oy}][${ox}][${iy}][${ix}] = ${this._map[oy][ox][iy][ix]} :${val===false?'fail ###':'pass_'}`);
				if(loopCount % 10000 == 0){
					this._draw();
					await this._sleep(0);
					// console.log(logs);
					logs.splice(0);
				}
				if(loopCount == 100000){
					if(!confirm('It takes too long... Do you agree to continue?')){
						throw new Error("User Interrupt");
					}
				}
				if(val===false){
					--ix; // 아직 '모순'판정까진 아니고, 일단은 for에 의해 현재의 ix가 다시 실행될 예정 = 다음 값으로 재도전하도록
					continue;
				}
			}
			logs.length && console.log(logs);
			console.log(`Generation finished in (${loopCount}/${loopLimit}).`);
		}
		// TODO: punch
		// TODO: shuffle
	}
	async _sleep(ms){
		return await new Promise(resolve=>{
			setTimeout(resolve, ms);
		});
	}
};