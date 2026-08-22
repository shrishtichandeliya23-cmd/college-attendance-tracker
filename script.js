const calendar = document.getElementById("calendar");

const monthYear = document.getElementById("monthYear");

const attendedElement =
    document.getElementById("attended");

const absentElement =
    document.getElementById("absent");

const percentageElement =
    document.getElementById("percentage");

const progressFill =
    document.getElementById("progressFill");

const goalMessage =
    document.getElementById("goalMessage");

const adviceTitle =
    document.getElementById("adviceTitle");

const adviceText =
    document.getElementById("adviceText");

const monthlyMonth =
    document.getElementById("monthlyMonth");

const monthlyAttended =
    document.getElementById("monthlyAttended");

const monthlyAbsent =
    document.getElementById("monthlyAbsent");

const monthlyPercentage =
    document.getElementById("monthlyPercentage");

const historyList =
    document.getElementById("historyList");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");


/* Attendance goal */

const attendanceGoal = 75;


/* Starting month */

let currentDate = new Date(2026, 7, 1);


/* Saved attendance */

let attendance =
    JSON.parse(
        localStorage.getItem("collegeAttendance")
    ) || {};


/* Saved college days */

let collegeDays =
    JSON.parse(
        localStorage.getItem("collegeDays")
    ) || [1, 2, 3, 4, 5];


/*
    0 = Sunday
    1 = Monday
    2 = Tuesday
    3 = Wednesday
    4 = Thursday
    5 = Friday
    6 = Saturday
*/


/* College day checkboxes */

const collegeDayCheckboxes =
    document.querySelectorAll(
        ".day-options input"
    );


collegeDayCheckboxes.forEach(
    function (checkbox) {

        const day =
            Number(checkbox.value);


        checkbox.checked =
            collegeDays.includes(day);


        checkbox.addEventListener(
            "change",
            function () {

                collegeDays = [];


                collegeDayCheckboxes.forEach(
                    function (box) {

                        if (box.checked) {

                            collegeDays.push(
                                Number(box.value)
                            );

                        }

                    }
                );


                localStorage.setItem(
                    "collegeDays",
                    JSON.stringify(collegeDays)
                );


                createCalendar();

                updateSummary();

            }
        );

    }
);


/* Create date key */

function getDateKey(
    year,
    month,
    day
) {

    return `${year}-${month + 1}-${day}`;

}


/* Save attendance */

function saveAttendance() {

    localStorage.setItem(
        "collegeAttendance",
        JSON.stringify(attendance)
    );

}


/* Create calendar */

function createCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    const monthName =
        currentDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    monthYear.textContent =
        `${monthName} ${year}`;


    monthlyMonth.textContent =
        `${monthName} ${year}`.toUpperCase();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* Monday first */

    let startingDay =
        firstDay - 1;


    if (startingDay === -1) {

        startingDay = 6;

    }


    /* Empty spaces */

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        calendar.appendChild(emptyDay);

    }


    /* Create dates */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayBox =
            document.createElement("div");


        dayBox.classList.add("day");


        dayBox.textContent = day;


        const date =
            new Date(
                year,
                month,
                day
            );


        const weekDay =
            date.getDay();


        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        /* Restore attendance */

        if (
            attendance[dateKey] ===
            "present"
        ) {

            dayBox.classList.add(
                "present"
            );

        }

        else if (
            attendance[dateKey] ===
            "absent"
        ) {

            dayBox.classList.add(
                "absent"
            );

        }


        /* Non-college day */

        if (
            !collegeDays.includes(
                weekDay
            )
        ) {

            dayBox.classList.add(
                "not-college"
            );

        }


        /* Click date */

        dayBox.addEventListener(
            "click",
            function () {

                if (
                    !collegeDays.includes(
                        weekDay
                    )
                ) {

                    return;

                }


                /* Empty → Present */

                if (
                    !attendance[dateKey]
                ) {

                    attendance[dateKey] =
                        "present";

                }


                /* Present → Absent */

                else if (
                    attendance[dateKey] ===
                    "present"
                ) {

                    attendance[dateKey] =
                        "absent";

                }


                /* Absent → Empty */

                else {

                    delete attendance[
                        dateKey
                    ];

                }


                saveAttendance();

                createCalendar();

                updateSummary();

            }
        );


        calendar.appendChild(dayBox);

    }

}


/* Get overall attendance */

function getOverallAttendance() {

    let attended = 0;

    let absent = 0;


    for (
        const dateKey in attendance
    ) {

        const parts =
            dateKey.split("-");


        const year =
            Number(parts[0]);


        const month =
            Number(parts[1]) - 1;


        const day =
            Number(parts[2]);


        const date =
            new Date(
                year,
                month,
                day
            );


        const weekDay =
            date.getDay();


        if (
            !collegeDays.includes(
                weekDay
            )
        ) {

            continue;

        }


        if (
            attendance[dateKey] ===
            "present"
        ) {

            attended++;

        }

        else if (
            attendance[dateKey] ===
            "absent"
        ) {

            absent++;

        }

    }


    return {
        attended,
        absent
    };

}


/* Get monthly attendance */

function getMonthlyAttendance() {

    let attended = 0;

    let absent = 0;


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    for (
        const dateKey in attendance
    ) {

        const parts =
            dateKey.split("-");


        const dateYear =
            Number(parts[0]);


        const dateMonth =
            Number(parts[1]) - 1;


        const day =
            Number(parts[2]);


        if (
            dateYear !== year ||
            dateMonth !== month
        ) {

            continue;

        }


        const date =
            new Date(
                dateYear,
                dateMonth,
                day
            );


        const weekDay =
            date.getDay();


        if (
            !collegeDays.includes(
                weekDay
            )
        ) {

            continue;

        }


        if (
            attendance[dateKey] ===
            "present"
        ) {

            attended++;

        }

        else if (
            attendance[dateKey] ===
            "absent"
        ) {

            absent++;

        }

    }


    return {
        attended,
        absent
    };

}


/* Update summary */

function updateSummary() {

    const overall =
        getOverallAttendance();


    const attended =
        overall.attended;


    const absent =
        overall.absent;


    const total =
        attended + absent;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (attended / total) * 100
            );

    }


    attendedElement.textContent =
        attended;


    absentElement.textContent =
        absent;


    percentageElement.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${Math.min(
            percentage,
            100
        )}%`;


    if (total === 0) {

        goalMessage.textContent =
            "Start marking your college days ♡";

    }

    else if (
        percentage >= attendanceGoal
    ) {

        goalMessage.textContent =
            "you're doing beautifully — keep going ♡";

    }

    else {

        goalMessage.textContent =
            "a little more effort and you'll get there ♡";

    }


    updateAdvice(
        attended,
        absent,
        percentage
    );


    updateMonthlyAttendance();

    updateHistory();

}


/* Monthly statistics */

function updateMonthlyAttendance() {

    const monthly =
        getMonthlyAttendance();


    const attended =
        monthly.attended;


    const absent =
        monthly.absent;


    const total =
        attended + absent;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (attended / total) * 100
            );

    }


    monthlyAttended.textContent =
        attended;


    monthlyAbsent.textContent =
        absent;


    monthlyPercentage.textContent =
        `${percentage}%`;

}


/* Attendance history */

function updateHistory() {

    historyList.innerHTML = "";


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    const monthEntries = [];


    for (
        const dateKey in attendance
    ) {

        const parts =
            dateKey.split("-");


        const dateYear =
            Number(parts[0]);


        const dateMonth =
            Number(parts[1]) - 1;


        const day =
            Number(parts[2]);


        if (
            dateYear !== year ||
            dateMonth !== month
        ) {

            continue;

        }


        const date =
            new Date(
                dateYear,
                dateMonth,
                day
            );


        const weekDay =
            date.getDay();


        if (
            !collegeDays.includes(
                weekDay
            )
        ) {

            continue;

        }


        monthEntries.push({
            day,
            status: attendance[dateKey]
        });

    }


    /* Sort dates */

    monthEntries.sort(
        function (a, b) {

            return a.day - b.day;

        }
    );


    /* No history */

    if (
        monthEntries.length === 0
    ) {

        historyList.innerHTML = `
            <p class="empty-history">
                Your attendance history will appear here ♡
            </p>
        `;

        return;

    }


    /* Create history items */

    monthEntries.forEach(
        function (entry) {

            const item =
                document.createElement("div");


            item.classList.add(
                "history-item"
            );


            const dateText =
                document.createElement("span");


            dateText.classList.add(
                "history-date"
            );


            dateText.textContent =
                `${monthName()} ${entry.day}`;


            const statusText =
                document.createElement("span");


            statusText.classList.add(
                "history-status"
            );


            if (
                entry.status ===
                "present"
            ) {

                statusText.classList.add(
                    "present"
                );

                statusText.textContent =
                    "attended ♡";

            }

            else {

                statusText.classList.add(
                    "absent"
                );

                statusText.textContent =
                    "absent —";

            }


            item.appendChild(
                dateText
            );


            item.appendChild(
                statusText
            );


            historyList.appendChild(
                item
            );

        }
    );

}


/* Current month name */

function monthName() {

    return currentDate.toLocaleString(
        "default",
        {
            month: "short"
        }
    );

}


/* Attendance advice */

function updateAdvice(
    attended,
    absent,
    percentage
) {

    const total =
        attended + absent;


    if (total === 0) {

        adviceTitle.textContent =
            "Your attendance story starts here ♡";

        adviceText.textContent =
            "Mark your college days to see how many days you can miss.";

        return;

    }


    if (
        percentage >= attendanceGoal
    ) {

        let canMiss = 0;

        let currentTotal =
            total;


        while (
            (
                attended /
                (currentTotal + 1)
            ) * 100
            >= attendanceGoal
        ) {

            canMiss++;

            currentTotal++;

        }


        adviceTitle.textContent =
            "You're above your 75% goal ♡";


        if (canMiss === 0) {

            adviceText.textContent =
                "Be careful — your next college day is important.";

        }

        else if (canMiss === 1) {

            adviceText.textContent =
                "You can miss 1 more college day and stay at 75% or above.";

        }

        else {

            adviceText.textContent =
                `You can miss ${canMiss} more college days and stay at 75% or above.`;

        }


        return;

    }


    let daysNeeded = 0;

    let futureAttended =
        attended;

    let futureTotal =
        total;


    while (
        futureTotal < 1000 &&
        (
            futureAttended /
            futureTotal
        ) * 100 < attendanceGoal
    ) {

        futureAttended++;

        futureTotal++;

        daysNeeded++;

    }


    adviceTitle.textContent =
        "Let's get you back to 75% ♡";


    if (daysNeeded === 1) {

        adviceText.textContent =
            "Attend your next college day and you'll reach 75%.";

    }

    else {

        adviceText.textContent =
            `You need to attend the next ${daysNeeded} college days in a row to reach 75%.`;

    }

}


/* Previous month */

prevMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        createCalendar();

        updateSummary();

    }
);


/* Next month */

nextMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        createCalendar();

        updateSummary();

    }
);


/* Start website */

createCalendar();

updateSummary();