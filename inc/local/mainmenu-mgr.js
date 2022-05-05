"use strict";

window.mainMenuMgr = new class MainMenuManager{
	constructor(){
		$(document)
			.ready(()=>{
				this._draw();
			})
	}

	_draw(){
		const PAGENAME_CURRENT = location.pathname.replace(/.*\//g,"").replace(/\..*/g,"")
		const $nav = $('<nav>').addClass("d-flex flex-wrap");
		$nav.append([{
			label: "첫 화면",
			pageName: "index",
			iconName: "",
			tintName: "",
		},{
			label: "검색",
			pageName: "search",
			iconName: "web",
			tintName: "sky",
		}].map(menuItemInfo=>{
			let isSelected = PAGENAME_CURRENT == menuItemInfo.pageName;

			return $('<a>').addClass("col col-3 col-sm-2 col-xxl-1 p-2").attr({
				'role': "menuitem",
				'aria-label': menuItemInfo.label,
				'href': isSelected ? null : `${menuItemInfo.pageName}.html`,
				'tabindex': isSelected?"-1":null,
			}).append([
				$('<div>').addClass("ratio ratio-1x1 bg-white").append([
					$('<button>').attr({
						'type': "button",
					}).addClass(`
						btn btn-outline-dark
						d-flex align-items-center justify-content-center
						${isSelected?"btn_selected":""}
					`).append([
						!menuItemInfo.iconName ? null :
						$('<img>').addClass(`w-100 tint_to_${menuItemInfo.tintName}`).attr({
							'src': `res/fg/${menuItemInfo.iconName}.svg`,
						}),
					]),
				]),
			]);
		}));
		$('body').children('nav').remove();
		$('body').append($nav);
		history.replaceState(history.state, `${PAGENAME_CURRENT.toUpperCase()} :: SJEGINK`);
	}
};