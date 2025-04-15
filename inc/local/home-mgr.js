"use strict";

const ATTR_INDEXER = "d-index";

window.homeMgr = new class HomeManager {
	constructor() {
		$(document)
			.ready(() => {
				this._draw();
				this._refresh();
			})
	}

	_draw() {
		// section > div.space(perspective) > div.face
		const $x = $($('section')[0] || $('<section>'));
		$x.addClass("m-auto").appendTo($('body'));
		$x.children().remove();
		// space
		const $s = $('<div>').addClass("space").appendTo($x);
		// calendar-display
		$('<div>').addClass("calendar").append([
			$('<div>').attr('data-month', -1).addClass("face"),
			$('<div>').attr('data-month', 0).addClass("face active"),
			$('<div>').attr('data-month', +1).addClass("face"),
		]).attr('data-selected-index', 0).appendTo($s).children().each((i, el) => {
			this._drawCalendar(i - 1);
			$(el).click(function (ev) {
				if ($(this).hasClass("active")) return;
				$(this).parent().attr('data-selected-index', i - 1);
				$(this).parent().children('.active').removeClass("active");
				$(this).addClass("active");
			});
		});
		// clock-display
		$('<div>').addClass("clock").append([
			$('<div>').addClass("top"),
			$('<div>').addClass("face"),
		]).appendTo($s);
		"012:34'56.789".match(/./g).forEach((v, i) => this._drawChar(i, v));
	}

	_refresh() {
		const dt = new Date();
		const h = dt.getHours(), H = String(h).padStart(2, 0);
		const m = dt.getMinutes(), M = String(m).padStart(2, 0);
		const s = dt.getSeconds(), S = String(s).padStart(2, 0);
		const l = dt.getMilliseconds(), L = String(l).padStart(3, 0);
		const halfFlag = Math.floor(l / 500) % 2, qtFlag = Math.floor(l / 250) % 2, octFlag = Math.floor(l / 125) % 2;
		`${'ap'[Math.floor(h / 12)]}${H}${halfFlag ? " " : ":"}${M}${qtFlag ? " " : "'"}${S}${octFlag ? " " : "'"}${L}`.match(/./g).forEach((v, i) => this._drawChar(i, v));
		const minDelay = 10, maxDelay = 100;
		setTimeout(() => this._refresh(), Math.floor(minDelay + Math.random() * (maxDelay - minDelay)));
	}

	_drawCalendar(i) {
		const dt = new Date();
		const dateNow = i ? null : dt.getDate();
		dt.setDate(1);
		dt.setMonth(dt.getMonth() + i);
		const $f = $('.calendar .face[data-month="' + i + '"]');
		const memoKey = 'sjegink-calendar-' + dt.getFullYear() + String(dt.getMonth() + 1).padStart(2, 0);
		const memoData = (raw => { try { return JSON.parse(raw || "{}"); } catch { return {} } })(localStorage.getItem(memoKey));
		$f.children().remove();
		const $h = $('<div>').addClass("header").appendTo($f).append([
			$('<p>').addClass("year").html(dt.getFullYear()),
			$('<p>').addClass("month").html(dt.getMonth() + 1),
		])
		const $b = $('<div>').addClass("body").appendTo($f);
		dt.setMonth(dt.getMonth() + 1);
		dt.setDate(0);
		const monthGot = dt.getMonth();
		const dMax = dt.getDate();
		dt.setDate(1);
		const dMin = 1 - dt.getDay();
		dt.setDate(dMin)
		for (let d = dMin; d < dMax + 7; d++) {
			if (dMax < d && 0 == dt.getDay()) break;
			const $d = $('<div>').addClass("day").append([
				$('<span>').html(dt.getDate()),
				monthGot !== dt.getMonth() ? null :
					$('<textarea>').attr('maxlength', 50).val(memoData[dt.getDate()]).on('focus', watchText).on('focusout', releaseText),
			]).appendTo($b);
			$d.addClass(
				monthGot !== dt.getMonth() ? "inactive" :
					dt.getDay() === 6 ? "saturday" :
						dt.getDay() === 0 ? "sunday" :
							null);
			if (monthGot === dt.getMonth() && dateNow === dt.getDate()) {
				$d.addClass("today");
			}
			dt.setTime(dt.getTime() + 86400000);
		}
		function watchText(ev) {
			const $t = $(this), d = $t.parent().children('span').text();
			let value = $t.val();
			$t.data('watch-intv', setInterval(() => {
				if ($t.val() !== value) {
					value = $t.val();
					save(d, value);
				}
			}, 1000));
		}
		function releaseText(ev) {
			const $t = $(this), d = $t.parent().children('span').text();
			clearInterval($t.data('watch-intv'));
			save(d, $t.val());
			$t.data('watch-intv', null)
		}
		function save(d, value) {
			memoData[d] = value;
			localStorage.setItem(memoKey, JSON.stringify(memoData));
		}
	}

	_drawChar(i, v) {
		const AttrName = "d-index";
		const $d = $($(`div[${AttrName}="${i}"]`)[0] || $('<div>').attr(AttrName, i).append((
			v === ":" ? [
				[null, '-', null],
				[null, '+', null],
			] :
				v === "'" ? [
					[null, '-', null],
				] :
					v === "." ? [
						[null, '+', null],
					] :
						[
							['0', '-', "horizontal"],
							['-', '-', "vertical"],
							['+', '-', "vertical"],
							['0', '0', "horizontal"],
							['-', '+', "vertical"],
							['+', '+', "vertical"],
							['0', '+', "horizontal"],
						]
		).map(args => createSpan(...args))).appendTo($('.clock .face')));
		let n = Object.assign({
			' ': 0b0000000,
			'-': 0b0001000,
			'a': 0b0111111,
			'p': 0b0011111,
		}, [
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
		if (n == null) n = v ? 0b11 : 0;
		let $ss = $d.children();
		for (let i = 0; i < $ss.length; i++) {
			$ss.eq(i)[n % 2 ? 'addClass' : 'removeClass']("is-active");
			n >>= 1;
		}
		return $d;
		function createSpan(x, y, t) {
			const $lamplet = $('<span>').addClass("lamplet").attr({
				'stroke-x': x,
				'stroke-y': y,
				'direction-type': t,
			}).append([
				$('<img>').attr({
					'src': `res/fg/clock_lamplet.svg`,
				}),
			]);
			return $lamplet;
		}
	}
};