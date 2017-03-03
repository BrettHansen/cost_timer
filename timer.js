var start_time = -1;
var timer_running = false;
var elapsed;
var units = {
	"Second"			: 1,
	"Minute"			: 60,
	"Hour"				: 60 * 60,
	"Day"				: 60 * 60 * 24,
	"Day (8 hours)"		: 60 * 60 * 8,
	"Week"				: 60 * 60 * 24 * 7,
	"Week (40 hours)"	: 60 * 60 * 40,
	"Month"				: 60 * 60 * 24 * 30,
	"Month (176 hours)"	: 60 * 60 * 176,
	"Year"				: 60 * 60 * 25 * 365.24,
	"Year (2000 hours)"	: 60 * 60 * 2000

}
var unit;
var unit_cost = 28.36;
var cost_per_second = 0;
var unit_display = $("#unit-display");

initialize();
function initialize() {
	$("#timer-start").click(function(e) { this.blur(); start_resume(); });
	$("#timer-reset").click(function(e) { this.blur(); reset(); });
	$(document).keydown(function(e) {
		if(e.which == 32) {
			start_resume();
		} else if(e.which == 82) {
			reset();
		}
	});

	$("#unit-cost").keydown(function(e) {
		if(e.keyCode == 13) {
			updateCostPerUnit($(this).val());
			$(this).blur();
		}
	}).val(unit_cost);

	createDropdown();
	updateUnit("Hour");
}

function createDropdown() {
	var dropdown_inner = $("#unit-dropdown ul");
	for(var u in units) {
		var li = $("<li>");
		var a  = $("<a>", {"class": "dropdown-item", "href": "#"}).text(u);
		li.append(a);
		dropdown_inner.append(li);
	}
	$(".dropdown-menu > li > a").click(function(e) {
		updateUnit($(this).text());
	});
}

function updateCostPerUnit(new_cost) {
	if(!isNaN(parseFloat(new_cost)) && isFinite(new_cost)) {
		unit_cost = parseFloat(new_cost);
		cost_per_second = unit_cost / units[unit];	
	}
}

function updateUnit(new_unit) {
	if(new_unit in units) {
		unit = new_unit;
		unit_display.text(unit);
		updateCostPerUnit(unit_cost);
	}
}

function start_resume() {
	if(timer_running) {
		timer_running = false;
		$("#timer-start").text("Resume");
	} else {
		$("#timer-start").text("Pause");
		if(start_time == -1) {
			start_time = time();
			timer_running = true;
			setTimeout(update, 10);
		} else if(!timer_running) {
			start_time = time() - elapsed;
			timer_running = true;
			setTimeout(update, 10);
		}
	}
}

function pause() {
	timer_running = false;
}

function reset() {
	$("#timer-start").text("Start");
	timer_running = false;
	start_time = -1;
	setTimeout(update, 10);
}

function update() {
	if(timer_running) {
		elapsed = time() - start_time;
		$("#timer").text(formatTime(elapsed));
		$("#cost").text(formatCurrency(elapsed * cost_per_second));
		setTimeout(update, 0);
	} else if(start_time == -1) {
		$("#timer").text(formatTime(0));
		$("#cost").text(formatCurrency(0));
	}
}

function time() {
	return (new Date()).getTime() / 1000;
}

function formatTime(t) {
	var tot_sec = t;
	var h = Math.floor(tot_sec / 3600).toString();
	var m = Math.floor(tot_sec % 3600 / 60).toString();
	var s = (tot_sec % 60).toFixed(2);
	while(h.length < 2)
		h = "0" + h;
	while(m.length < 2)
		m = "0" + m;
	while(s.length < 5)
		s = "0" + s;
	return h + ":" + m + ":" + s;
}

function formatCurrency(m) {
	pos = "";
	if(m < 0) {
		pos = "-";
		m *= -1;
		$("#cost").addClass("negative-cost");
		$("#cost").removeClass("positive-cost");
	} else {
		$("#cost").addClass("positive-cost");
		$("#cost").removeClass("negative-cost");
	}
	var v = m.toFixed(2);
	while(v.length < 4)
		v = "0" + v;
	for(var i = 1; i < v.length - 5; i++) {
		if((v.length - 3 - i) % 3 == 0) {
			v = v.slice(0, i) + "," + v.slice(i);
			i++;
		}
	}
	return pos + "$" + v;
}
