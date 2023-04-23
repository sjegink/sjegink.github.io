"use strict";

window.sudokuMgr = new class SudokuManager{

	_map;

	constructor(){
		$(document)
			.ready(async ()=>{
				this._clear();
				await this.generate(5);
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
		// #0 STAND-BY
		const radix = Math.pow(size,2);
		const chars = new Array(radix).fill('\0').map((_,i)=>i.toString(36));
		if(radix < 10){
			chars.shift();
			chars.push(radix);
		}
		const _build = fill=>new Array(size).fill(0).map(fill);
		let ox,oy, ix,iy, checkpoint = new Date().getTime();
		// #1 GENERATE FULL-VERSION
		const presets = {
			4: [
				"됰릖뱭꼮룶귔뵠긆릚꾺됹뤀꽍꿛냟럣군뱾눺릎됩뚄멅갭꽽됹뗲꿫받둒롊릹뚯깠뀷녍걫랇궒땙늫갰뜁몱굼껵륡뵩껄뉍몂댆겮긩뱙겱녒귡묙곍뙎롔땚듉밋뗰뵗돽뛹걏뉅믚끆롑교껈눮녞겣꿔",
				"뛗뇁먛뮪깅뎐뱁뙕갔맘눤묰끠걆눌뛞뀔뛰땙볍뇈뎔볲뛔냟득뭶눏뷓겊뢅렙뢄묈꼹렙돫뵘뚈붲굱뫖곹낎뫅맰꼶꿴먋뫒곴뤞굴늢굉넢걺뗟뭞륉믒럩뇖땇렽꽇뙤멋걸뫠뚶릟듢붟녎맶뭀뒔갓늜",
				"늯먕뮛깻럪냎럡뙋듡묃뢥벴랈몌냙땰뮪낟롰딽뛼뎁귈뒻넴뫒늰껃뫦늞붐걅댣꿾봿걸뤣묚눷뢸민뮯객농묵굟뚄믷곦깼늙띪뢷릨끓뷁냻뗮뉖봎깏렉땠덫뚆루낸먶뷚껸뫺늞꽄닟걺단뗕뷪뚥넹",
				"료봙뫮돭뛗궯넫렑묑괣꿡렵본귱꾊땹뚨궉룃렣볍녰렅뙆냬밦둱뀳렯볔걞궒댩걂냼룼렘뭚봒걊눺뱐뜁륢봙뭛댾갸괦덆벃릱놐떝됶뀴겚뷟랿믧뤺렫놧덆뀺걳뙒볗딞냮뜋뱔먕꺀띌둆낕떧뢫볙",
				"롔떭굡겅냛덥몇뵷굇뉒뒩냦렓꺁돍똪롁맇듉걊봜긡뗏꼹꿤몱댛녣붞덗뢃멽뇟뎁굱봟뚾렮땣봉뢪렼갭닐벷됑봸꿽믨릳꾭몴뤂랐봢럝믨눘먊돓귐갭뫺맇궽맽놋밣뒞꺆렳미꿛뚉돇뉨묧뜮렗밒",
				"뚨띾괌림뎆냮륬멷놬뀖딧뉾뛮딝뵕됌랎긮뚀땈뒾뎠뵕넯뉉둼꾐꾊듐딟랎볖듌뙑뀪곽띠냟괯랐뜵멊둱꾲괧뚪뱥늎묲먣뉤굔뙑럡뛠꿦닳뇷갔꽅뭴밴눿둹럓걊뙧뵳민늘뚞띑먕꺀녬며눮깿놁뚏",
				"먌믑뗪닦뢑랸놌귦민몴뇥뤚뷩깉낿귀붭띣곚댿뇶뙔맓붞뭀궇뱌뮠꺏덳곍륲궯겄벍늭꼑띻궬럣묰냸룄륑뷤깘던릏몀걉귟띵뮴됤눨뎫믙붌깝걒뤼덢뗬꽂뙉돁깉냤떵맭됑뙝볹벏뫼꿸롐냬귲똷",
				"랗륛딕뀾돾눫늌귰갰덣룻뎠뷗똾눦갥띏긑묀뗚꿥뜰껄뙢녦믘귰뢽궧릷겷덓뮂댣겭룣꽏냵꿭맞능겁뜏붚꿧뗚밗경냠거뛬끂벛뷟뭹긥뒊룔넗꿷구뉌봞닐꺗럠뷒룥귱뜶댕갼멳굾껂됅먼꺋딓밐",
			],
		}[size];
		if(presets && presets.length){
			const presetValues = this._decodePresetCode(presets[Math.floor(Math.random()*presets.length)],radix).split("");
			this._map = _build(()=>_build(()=>_build(()=>_build(()=>presetValues.shift()))));
		}else{
			this._map = _build(()=>_build(()=>_build(()=>_build(()=>null))));
			for(let i=0,j; i<size; i++) for(j=0; j<size; j++){
				// first(0,0) box is fixed. (it will be shuffled in step #3)
				this._map[0][0][i][j] = //&_
				this._map[0][i][0][j] = //&_
				this._map[i][0][j][0] = chars[i*size + j];
			}
			const cands = JSON.parse(JSON.stringify(this._map));
			const _backward = ()=>{
				ix--;
				if(-1 < ix) return; else{  ix += size;  iy--;  }
				if(-1 < iy) return; else{  iy += size;  ox--;  }
				if(-1 < ox) return; else{  ox += size;  oy--;  }
				if(oy+iy==0) _backward(); // first(0,0) row is fixed by code above.
				if(ox+ix==0) _backward(); // first(0,0) col is fixed by code above.
			};
			const logs = [];
			let tickCount = 0;
			const tickLimit = Math.pow(radix, 4) * 6;
// const tickLimit = NaN;
			for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++) for(iy=0; iy<size; iy++) for(ix=0; ix<size; ix++){
				if(oy+ox==0) continue; // first(0,0) box is fixed by code above.
				if(oy+iy==0) continue; // first(0,0) row is fixed by code above.
				if(ox+ix==0) continue; // first(0,0) col is fixed by code above.
				if(tickLimit <= ++tickCount){
					this._flushLogs(logs);
					throw new Error(`TICK LIMIT (${tickLimit})`);
				}
				let val;
				if(cands[oy][ox][iy][ix] == null){
					cands[oy][ox][iy][ix] = Array.from(chars);
					cands[oy][ox][iy][ix] = cands[oy][ox][iy][ix].map(ch=>this._has(ch,oy,ox,iy,ix)?null:ch).filter(ch=>ch!=null);
					cands[oy][ox][iy][ix].sort(()=>Math.random()-.5);
					logs.push(`[${oy}][${ox}][${iy}][${ix}] :init(${cands[oy][ox][iy][ix].join(",")})`);
				}else{
					logs.push(`[${oy}][${ox}][${iy}][${ix}] :retry(${cands[oy][ox][iy][ix].join(",")})`);
				}
				
				if(tickCount % 100 == 0){
					this._draw();
					await this._sleep(0);
					this._flushLogs(logs);
				}
				if(tickCount == 100000){
					if(!confirm('It takes too long... Do you agree to continue?')){
						throw new Error("User Interrupt");
					}
				}

				if(0 === cands[oy][ox][iy][ix].length){
					logs.push(`[${oy}][${ox}][${iy}][${ix}] :back`);
					cands[oy][ox][iy][ix] = null;
					this._map[oy][ox][iy][ix] = null;
					_backward(--ix);
					continue;
				}
				this._map[oy][ox][iy][ix] = val = cands[oy][ox][iy][ix].shift();
				logs.push(`[${oy}][${ox}][${iy}][${ix}] = ${this._map[oy][ox][iy][ix]}`);
			}
			this._flushLogs(logs);
			console.log(`Generation finished in (${tickCount}/${tickLimit}, ${String(-checkpoint+(checkpoint=new Date().getTime())).replace(/\B(\d{3})+$/g,",")}ms).`);
		}
		let presetCode = this._buildPresetCode(this._map.map(arr=>arr.map(arr=>arr.map(arr=>arr.join("")).join("")).join("")).join(""));
		console.log(`Preset code: ${presetCode}`);
		console.log(`decode: ${this._decodePresetCode(presetCode, radix)}`);
		// TODO: punch
		// TODO: shuffle
	}
	/**
	 * Find the value in the cell(s)
	 * @param val {string} Value to be found
	 * @param coordArgs {...number} As [oy,ox,iy,ix]. If give two null values of those, they will be replaced varietely by for-loop.
	 * @param [isOne] {boolean} stop if anything was found.
	 * @return {Array<object>} objects that have
	 */
	_find(val, oy,ox,iy,ix, _isOne){
		const results = [], isFixed=[oy,ox,iy,ix].map(arg=>arg!=null);
		const getCell = (i,j)=>{
			[oy,ox,iy,ix] = [oy,ox,iy,ix].map((arg,i)=>isFixed[i]?arg:'null').join('\t').replace('null',i).replace('null',j).split('\t').map(arg=>parseInt(arg));
			return {
				oy,ox,iy,ix,
				value: String(this._map[oy][ox][iy][ix]),
			};
		}
		for(let i=0,j; i<this._map.length; i++){
			for(j=0; j<this._map.length; j++) {
				const cell = getCell(i,j);
				if(String(val)===cell.value){
					results.push(cell);
					if(_isOne) return results;
				}
			}
		}
		return results;
	}
	_has(val, oy,ox,iy,ix){
		return 0 < this._find(val, oy,ox,null,null, true).length ||
			0 < this._find(val, oy,null,iy,null, true).length ||
			0 < this._find(val, null,ox,null,ix, true).length;
	}
	_buildPresetCode(str){
		const radixI = Math.sqrt(str.length);
		const radixO = 1+'힣'.charCodeAt(0)-'가'.charCodeAt(0);
		str = str.substring(radixI);
		if(radixI<10) str = str.replace(radixI, '0');
		const buff = this._convertRadix(str.split("").map(ch=>parseInt(ch,radixI)), radixI, radixO);
		return buff.map(n=>String.fromCharCode('가'.charCodeAt(0)+n)).join("");
	}
	_decodePresetCode(str, radixO){
		const radixI = 1+'힣'.charCodeAt(0)-'가'.charCodeAt(0);
		const buff = this._convertRadix(str.split("").map(ch=>ch.charCodeAt(0)-'가'.charCodeAt(0)), radixI, radixO);
		str = buff.map(n=>n.toString(radixO)).join("");
		str = new Array(radixO).fill().map((_,i)=>i.toString(radixO)).join("") + str;
		if(radixO<10) str = str.replace('0', radixO);
		return str;
	}
	_convertRadix(buff, radixI, radixO){
		if(radixI < radixO){
			const radixIP = radixI+1; // includes padding
			const ACC_TIMES = Math.floor(Math.log(radixO) / Math.log(radixIP));
			let i = 0, acc = 0;
			if(buff.length % ACC_TIMES){
				buff = buff.concat(new Array(ACC_TIMES-buff.length%ACC_TIMES).fill(radixI));
			}
			buff = buff.reduce((arr,n,i)=>{
				acc = acc * radixIP + n;
				if(++i % ACC_TIMES == 0){
					arr.push(acc);
					acc = 0;
				}
				return arr;
			},[]);
		}else{
			const radixOP = radixO+1; // includes padding
			const ACC_TIMES = Math.floor(Math.log(radixI) / Math.log(radixOP));
			buff = buff.reduce((arr,n)=>{
				let _3 = [];
				for(let i=0; i<ACC_TIMES; i++){
					_3.unshift(n % radixOP);
					n = Math.floor(n/radixOP);
				}
				return arr.concat(_3);
			},[]);
			buff = buff.filter(v=>v<radixO);
		}
		return buff;
	}
	async _sleep(ms){
		return await new Promise(resolve=>{
			setTimeout(resolve, ms);
		});
	}
	_flushLogs(logs){
		while(logs.length){
			const output = logs.splice(0,100);
			// console.log({output});
		}
	}
};