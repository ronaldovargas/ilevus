
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var FULL_MONTHS = [
	Messages.get("MonthJanuary"),
	Messages.get("MonthFebruary"),
	Messages.get("MonthMarch"),
	Messages.get("MonthApril"),
	Messages.get("MonthMay"),
	Messages.get("MonthJune"),
	Messages.get("MonthJuly"),
	Messages.get("MonthAugust"),
	Messages.get("MonthSeptember"),
	Messages.get("MonthOctober"),
	Messages.get("MonthNovember"),
	Messages.get("MonthDecember")
];

var SHORT_MONTHS = [
	Messages.get("MonthJanuaryAbbr"),
	Messages.get("MonthFebruaryAbbr"),
	Messages.get("MonthMarchAbbr"),
	Messages.get("MonthAprilAbbr"),
	Messages.get("MonthMayAbbr"),
	Messages.get("MonthJuneAbbr"),
	Messages.get("MonthJulyAbbr"),
	Messages.get("MonthAugustAbbr"),
	Messages.get("MonthSeptemberAbbr"),
	Messages.get("MonthOctoberAbbr"),
	Messages.get("MonthNovemberAbbr"),
	Messages.get("MonthDecemberAbbr")
];

var FULL_DAYS = [
	Messages.get("DaySunday"),
	Messages.get("DayMonday"),
	Messages.get("DayTuesday"),
	Messages.get("DayWednesday"),
	Messages.get("DayThursday"),
	Messages.get("DayFriday"),
	Messages.get("DaySaturday")
];

var SHORT_DAYS = [
	Messages.get("DaySundayAbbr"),
	Messages.get("DayMondayAbbr"),
	Messages.get("DayTuesdayAbbr"),
	Messages.get("DayWednesdayAbbr"),
	Messages.get("DayThursdayAbbr"),
	Messages.get("DayFridayAbbr"),
	Messages.get("DaySaturdayAbbr")
];

/**
	Formats a date following a format with the following qualifiers:

	%d The date number from 1 to 31.
	%D The date number from 01 to 31.
	%w The week day short name.
	%W The week day full name.
	%m The month number from 1 to 12.
	%M The month number from 01 to 12.
	%n The month short name.
	%N The month full name.
	%y The two digit year.
	%Y The four digit year.
*/
var FORMATTING_REGEX = /\%[dDwWmMnNyY]/g;
function formatDate(date, format) {
	if (!date || !format) {
		return "";
	}
	if (typeof date === 'string') {
		date = new Date(date);
	}
	return format.replace(FORMATTING_REGEX, (match) => {
		switch (match) {
			case "%d": return date.getDate();
			case "%D":
				if (date.getDate() < 10)
					return "0"+date.getDate();
				return date.getDate();
			case "%w": return SHORT_DAYS[date.getDay()];
			case "%W": return FULL_DAYS[date.getDay()];
			case "%m": return date.getMonth()+1;
			case "%M":
				if (date.getMonth() < 9)
					return "0"+(date.getMonth()+1);
				return date.getMonth()+1;
			case "%n": return SHORT_MONTHS[date.getMonth()];
			case "%N": return FULL_MONTHS[date.getMonth()];
			case "%y": return date.getFullYear()%100;
			case "%Y": return date.getFullYear();
		}
	});
}

module.exports = {
	formatDate: formatDate
};
