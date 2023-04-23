"use strict";

window.sudokuMgr = new class SudokuManager{

	_map;

	constructor(){
		$(document)
			.ready(async ()=>{
				this._clear();
				await this.generate(6);
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
		if(size>6){
			console.warn("Size must be less than or equal to 6");
			size = 6;
		}
		const radix = Math.pow(size,2);
		const chars = new Array(radix).fill('\0').map((_,i)=>i.toString(36)).sort(()=>Math.random()-.5);
		if(radix < 10){
			chars.shift();
			chars.push(radix);
		}
		const _build = fill=>new Array(size).fill(0).map(fill);
		let ox,oy, ix,iy, checkpoint = new Date().getTime();
		// #1 GENERATE FULL-VERSION
		this._map = _build(()=>_build(()=>_build(()=>_build(()=>null))));
		for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++) for(iy=0; iy<size; iy++) for(ix=0; ix<size; ix++){
			this._map[oy][ox][iy][ix] = null;
			let val = chars[(oy + ox*size + iy*size + ix) % radix];
			if(this._has(val, oy,ox,iy,ix)){
				throw new Error('duplicate :'+ val+ [oy,ox,iy,ix]);
			}
			this._map[oy][ox][iy][ix] = val;
		}
		// let presetCode = this._buildPresetCode(this._map.map(arr=>arr.map(arr=>arr.map(arr=>arr.join("")).join("")).join("")).join(""));
		// console.log(`Preset code: ${presetCode}`);
		// console.log(`decode: ${this._decodePresetCode(presetCode, radix)}`);
		// #2 SWAP CELLS
		oy = ox = 0;
		const targets = new Array(radix).fill().map((_,i)=>new this.CellInfo(oy,ox,Math.floor(i/size),i%size));
		targets.sort(()=>Math.random()-.5);
		// targets.splice(radix);
		for(let i in targets){
			let newVal = chars[Math.floor(Math.random()*(chars.length-1))];
			if(newVal==targets[i].value) newVal = chars[chars.length-1];
			await this._adjustCell(targets[i],newVal);
			await this._verify().catch(e=>{this._draw(); throw e; });
		}
		this._evaluateComplex();
		// #3 LINEAR SHUFFLE
		const ySort = new Array(size).fill().map((_,i)=>i).sort(()=>Math.random()-.5);
		const xSort = new Array(size).fill().map((_,i)=>i).sort(()=>Math.random()-.5);
		this._map = ySort.map(oy=>{
			return xSort.map(ox=>this._map[oy][ox]);
		});
		ySort.sort(()=>Math.random()-.5);
		xSort.sort(()=>Math.random()-.5);
		for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++){
			this._map[oy][ox] = ySort.map(iy=>{
				return xSort.map(ix=>this._map[oy][ox][iy][ix]);
			});
		}
		this._evaluateComplex();
		this._verify();
		// #4 ERASING PUNCH
		return;
		let erasable = true;
		while(erasable){
			erasable = false;
			for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++){
				const cell = this.CellInfo.get(oy,ox,NaN,NaN).filter(cell=>cell.value!=null).sort(()=>Math.random()-.5);
				if(this._tryPunch(cell)){
					erasable = true;
				}
			}
		}
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
			return new this.CellInfo(oy,ox,iy,ix);
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
	async _adjustCell(cell, value){
		const backup = JSON.stringify(this._map);
		const _run = async (cell, value, limitCounter)=>{
			let valueBefore = cell.value;
			cell.setValue(value);
			let conflicts = [].concat(...[
				this._find(cell.value, cell.oy,cell.ox,null,null),
				this._find(cell.value, cell.oy,null,cell.iy,null),
				this._find(cell.value, null,cell.ox,null,cell.ix),
			]);
			let hasConflict = conflicts.length;
			while(hasConflict){
				hasConflict = false;
				await PromiseUtils.forEach(conflicts, async (cf)=>{
					if(this.CellInfo.same(cell,cf) || cf.reload().value != value){
						return;
					}
					limitCounter--;
					if(limitCounter % 100 == 0) await this._sleep(0);
					if(limitCounter<0) throw new Error('limit exceed');
					await _run(cf, valueBefore, limitCounter);
					hasConflict = true;
				});
			}
		}
		try{
			await _run(cell, value, 1024);
			await this._verify();
		}catch(e){
			if(/limit exceed/.test(e) || /Duplicated/.test(e)){
				console.warn(`Rollback(${e.message.replace(/:.*/,"")})`);
				this._map = JSON.parse(backup);
				return;
			}
			throw e;
		}
	}
	_tryPunch(cell){
		let oy,ox,iy,ix;
		const size = this._map.length;
		for(oy=0; oy<size; oy++) for(iy=0; iy<size; iy++){
			if(cell.oy==oy && cell.iy==iy) continue;

		}
	}
	/** how board complexed. */
	_evaluateComplex(){
		let evolCount = 0;
		const size = this._map.length;
		const chars = new Array(Math.pow(size,2)).fill('\0').map((_,i)=>i.toString(36));
		const totalCount = Math.pow(chars.length, 2), basingTable={};
		let oy=0,ox=0,iy,ix;
		for(iy=0; iy<size; iy++) for(ix=0; ix<size; ix++){
			let org = chars[(oy + ox*size + iy*size + ix) % chars.length];
			let adj = this._map[oy][ox][iy][ix];
			if(adj!=org) basingTable[adj]=org;
		}
		for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++) for(iy=0; iy<size; iy++) for(ix=0; ix<size; ix++){
			let cell = new this.CellInfo(oy,ox,iy,ix);
			let val = basingTable[cell.value];
			let org = chars[(oy + ox*size + iy*size + ix) % chars.length];
			evolCount += org==cell.value ? 0 : 1;
		}
		console.log(`evoluted cells = ${evolCount} / ${totalCount} (${(100*evolCount/totalCount).toFixed(0)}%)`);
	}
	async _verify(){
		let oy,ox,iy,ix;
		const size = this._map.length;
		for(oy=0; oy<size; oy++) for(ox=0; ox<size; ox++){
			this.CellInfo.get(oy,ox,NaN,NaN).reduce(reducer,{});
		}
		for(oy=0; oy<size; oy++) for(iy=0; iy<size; iy++){
			this.CellInfo.get(oy,NaN,iy,NaN).reduce(reducer,{});
		}
		for(ox=0; ox<size; ox++) for(ix=0; ix<size; ix++){
			this.CellInfo.get(NaN,ox,NaN,ix).reduce(reducer,{});
		}
		function reducer(acc,cell){
			const cf = acc[cell.value];
			if(cf){
				throw new Error(`Duplicated Value Found: ` + cell+' = '+cf);
			}else{
				acc[cell.value] = cell;
				return acc;
			}
		}
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

	CellInfo = ((mgr,CellInfo)=>{
		Object.assign(CellInfo.prototype, {
			reload: function(){
				this.value = mgr._map[this.oy][this.ox][this.iy][this.ix];
				return this;
			},
			update: function(){
				mgr._map[this.oy][this.ox][this.iy][this.ix] = this.value;
				return this;
			},
			setValue: function(val, isUpdate){
				this.value = val;
				if(isUpdate!==false) this.update();
			},
			toString: function(){
				const {oy,ox,iy,ix,value:val} = this;
				return `${this.constructor.name}{[${[ox,oy]}][${[ix,iy]}]="${val}"}`;
			},
		});
		return Object.assign(CellInfo,{
			same(c1,c2){
				return c1.oy==c2.oy && c1.ox==c2.ox && c1.iy==c2.iy && c1.ix==c2.ix;
			},
			fromValueInBox(val, oy,ox){
				for(let iy=0,ix;iy<mgr._map.length;iy++) for(ix=0;ix<mgr._map.length;ix++){
					if(mgr._map[oy][ox][iy][ix]==val){
						return new CellInfo(oy,ox,iy,ix);
					}
				}
				return null;
			},
			fromValueInRow(val, oy,iy){
				for(let ox=0,ix;ox<mgr._map.length;ox++) for(ix=0;ix<mgr._map.length;ix++){
					if(mgr._map[oy][ox][iy][ix]==val){
						return new CellInfo(oy,ox,iy,ix);
					}
				}
				return null;
			},
			fromValueInCol(val, ox,ix){
				for(let oy=0,iy;oy<mgr._map.length;oy++) for(iy=0;iy<mgr._map.length;iy++){
					if(mgr._map[oy][ox][iy][ix]==val){
						return new CellInfo(oy,ox,iy,ix);
					}
				}
				return null;
			},
			get(oy,ox,iy,ix){
				const size = mgr._map.length;
				const [aoy,aox,aiy,aix] = [oy,ox,iy,ix].map(v=>parseInt(v));
				if(isNaN(aoy+aox+aiy+aix)){
					const arr = [];
					for(oy=isNaN(aoy)?0:aoy; oy<(isNaN(aoy)?size:aoy+1); oy++)
					for(ox=isNaN(aox)?0:aox; ox<(isNaN(aox)?size:aox+1); ox++)
					for(iy=isNaN(aiy)?0:aiy; iy<(isNaN(aiy)?size:aiy+1); iy++)
					for(ix=isNaN(aix)?0:aix; ix<(isNaN(aix)?size:aix+1); ix++)
					{
						arr.push(new CellInfo(oy,ox,iy,ix));
					}
					return arr;
				}else{
					return new CellInfo(oy,ox,iy,ix);
				}
			}
		});
	})(this, class CellInfo{
		oy;ox;iy;ix;value;
		constructor(oy,ox,iy,ix, value){
			Object.assign(this, {oy,ox,iy,ix,value});
			if(value===undefined) this.reload();
		}
	});
};