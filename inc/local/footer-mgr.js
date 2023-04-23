"use strict";

window.footerMgr = new class FooterManager{
	constructor(){
		$(document)
			.ready(()=>{
				this._draw();
			})
	}

	_draw(){
		const PAGENAME_CURRENT = location.pathname.replace(/.*\//g,"").replace(/\..*/g,"")
		const $footer = $('<footer>').addClass("text-center my-4");
		$('<nav>').addClass("small d-flex flex-wrap justify-content-center").append([{
			label: "Home",
			pageName: "index",
		},{
			label: "Search",
			pageName: "search",
		},{
			label: "SUDOKU",
			pageName: "sudoku",
		}].map(menuItemInfo=>{
			let isSelected = PAGENAME_CURRENT == menuItemInfo.pageName;
			if(isSelected) return null;

			return $('<a>').addClass("").attr({
				'role': "menuitem",
				'aria-label': menuItemInfo.label,
				'href': isSelected ? null : `${menuItemInfo.pageName}.html`,
				'tabindex': isSelected?"-1":null,
			}).append([
				$('<span>').addClass("").html(menuItemInfo.label),
			]);
		})).appendTo($footer);
		$('body').children('footer').remove();
		$('body').append($footer);
		history.replaceState(history.state, `${PAGENAME_CURRENT.toUpperCase()} :: SJEGINK`);
	}
};