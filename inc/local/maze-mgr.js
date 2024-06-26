"use strict";

window.mazeMgr = new class MazeManager{
	constructor(){
		$(document)
			.ready(()=>{
				this.generateMap();
			})
	}

	generateMap(){
		const size = 32;
		this._map = Array(32).fill().map(()=>Array(32).fill(null));
		
	}
	_debugMap(){
		$('.div_mapdebug').remove();
		const $mapDebug =$('<div>').addClass('.div_mapdebug').append((this._map||[]).map(arr=>{
			return $('<div>').addClass('.div_mapdebug__row').append(arr.map(cell=>{
				return $('<div>').addClass('.div_mapdebug__cell');
			}));
		})).appendTo($('body'));
	}
}