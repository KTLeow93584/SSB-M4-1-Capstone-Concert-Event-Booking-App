// ==============================================
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const defaultDenominator = "th";

const denominators = [
    "st",
    "nd",
    "rd"
];

const timezoneAbbrs = {
    "-11": "UTC-11",
    "-10": "UTC-10",
    "-09": "AKST",
    "-08": "PST",
    "-07": "MST",
    "-06": "CST",
    "-05": "UTC-05",
    "-04": "EDT",
    "-03": "UTC-03",
    "-02": "UTC-02",
    "-01": "UTC-01",
    "+00": "UTC",
    "+01": "UTC+01",
    "+02": "UTC+02",
    "+03": "UTC+03",
    "+04": "UTC+04",
    "+05": "UTC+05",
    "+06": "UTC+06",
    "+07": "UTC+07",
    "+08": "SGT",
    "+09": "JST",
    "+10": "AEST",
    "+11": "AEDT",
};

const millisecondsInAMinute = 1000 * 60;
const millisecondsInAnHour = millisecondsInAMinute * 60;
const millisecondsInADay = millisecondsInAnHour * 24;
const millisecondsInAWeek = millisecondsInADay * 7;
// ==============================================
export function formatTime(date, skipSeconds = false) {
    let hours = date.getHours() % 12;
    const isPm = Math.floor(date.getHours() / 12) >= 1;

    if (hours === 0)
        hours += 12;

    let result = `${hours.toString().padStart(2, "0")}`;
    result += `:${date.getMinutes().toString().padStart(2, "0")}`;

    if (!skipSeconds)
        result += `:${date.getSeconds().toString().padStart(2, "0")} `;

    result += isPm ? " PM" : " AM";

    return result;
}

export function formatDate(date, skipDay = false) {
    const dateNo = date.getDate();
    let result = `${!skipDay ? (days[date.getDay()] + ", ") : ""}${dateNo + (dateNo - 1 >= denominators.length ? defaultDenominator : denominators[dateNo - 1])} 
    ${months[date.getMonth()]}, ${date.getFullYear()}`;

    return result;
}

export function formatTimezone(date, shortFormat = false, skipMinutes = false) {
    const timezoneOffset = date.getTimezoneOffset();
    const minutesPerHour = 60;
    const timezoneHours = Math.abs(Math.floor(timezoneOffset / minutesPerHour));
    const timezoneMinutes = Math.abs(timezoneOffset % minutesPerHour);

    let result = `GMT${timezoneOffset < 0 ? "+" : "-"}${timezoneHours.toString().padStart(2, "0")}`;

    if (!skipMinutes)
        result += `:${timezoneMinutes.toString().padStart(2, "0")}`;

    if (!shortFormat)
        result = `${Intl.DateTimeFormat().resolvedOptions().timeZone} - ${result}`;

    return result;
}

export function formatTimezoneSimpleParseH(hours) {
    const hoursAbs = Math.abs(hours);

    let result = `GMT${hours < 0 ? "-" : "+"}`;
    result += `${hoursAbs.toString().padStart(2, "0")}`;
    
    return result;
}

export function formatTimezoneSimpleParseHM(hours, minutes) {
    const hoursAbs = Math.abs(hours);

    let result = `GMT${hours < 0 ? "-" : "+"}`;
    result += `${hoursAbs.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    
    return result;
}

export function getTimeFromNow(date) {
    const diffMS = Date.now() - date.getTime();
    // ===========
    // Weeks
    const diffWeek = Math.floor(diffMS / millisecondsInAWeek);

    // Debug
    //console.log("Difference in Weeks", diffWeek);
    
    if (diffWeek > 0)
        return diffWeek + "w";
    // ===========
    // Days
    const diffDay = Math.floor(diffMS / millisecondsInADay);

    // Debug
   // console.log("Difference in Days", diffDay);

    if (diffDay > 0)
        return diffDay + "d";
    // ===========
    // Hours
    const diffHour = Math.floor(diffMS / millisecondsInAnHour);

    // Debug
    //console.log("Difference in Hours", diffHour);

    if (diffHour > 0)
        return diffHour + "h";
    // ===========
    // Minutes
    const diffMinute = Math.floor(diffMS / millisecondsInAMinute);

    // Debug
    //console.log("Difference in Minutes", diffMinute);

    if (diffMinute > 0)
        return diffMinute + "m";
    // ===========
    // Very Recent - Less than a minute ago.
    return "Just Now";
    // ===========
}
// ==============================================
export {
    days, months,
    defaultDenominator, denominators, timezoneAbbrs,
    millisecondsInAMinute, millisecondsInAnHour
};
// ==============================================