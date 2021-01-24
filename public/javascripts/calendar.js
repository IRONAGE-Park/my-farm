// ================================
// START YOUR APP HERE
// ================================

const init = {
    monEnglishList: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    monKoreanList: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
    ],
    dayList: [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
    ],
    today: new Date(),
    monForChange: new Date().getMonth(),
    activeDate: new Date(),
    getFirstDay: (yy, mm) => new Date(yy, mm, 1),
    getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
    nextMonth: function () {
        let d = new Date();
        d.setDate(1);
        d.setMonth(++this.monForChange);
        this.activeDate = d;
        return d;
    },
    prevMonth: function () {
        let d = new Date();
        d.setDate(1);
        d.setMonth(--this.monForChange);
        this.activeDate = d;
        return d;
    },
    addZero: (num) => (num < 10 ? '0' + num : num),
    activeDTag: null,
    getIndex: function (node) {
        let index = 0;
        while ((node = node.previousElementSibling)) {
            index++;
        }
        return index;
    },
};

const $calBody = document.querySelector('.cal-body');
const $btnNext = document.querySelector('.btn-cal.next');
const $btnPrev = document.querySelector('.btn-cal.prev');

/**
 * @param {number} date
 * @param {number} dayIn
 */
function loadDate(date, dayIn) {
    document.querySelector('.cal-date').textContent = date;
    document.querySelector('.cal-day').textContent = init.dayList[dayIn];
}

/**
 * @param {date} fullDate
 */
function loadYYMM(fullDate) {
    let yy = fullDate.getFullYear();
    let mm = fullDate.getMonth();
    let firstDay = init.getFirstDay(yy, mm);
    let lastDay = init.getLastDay(yy, mm);
    let markToday; // for marking today date

    if (mm === init.today.getMonth() && yy === init.today.getFullYear()) {
        markToday = init.today.getDate();
    }

    document.querySelector('.cal-month').textContent = init.monKoreanList[mm];
    document.querySelector('.cal-year').textContent = yy + '년';

    let trtd = '';
    let startCount;
    let countDay = 0;
    for (let i = 0; i < 6; i++) {
        trtd += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && !startCount && j === firstDay.getDay()) {
                startCount = 1;
            }
            if (!startCount) {
                trtd += '<td>';
            } else {
                let fullDate =
                    yy +
                    '-' +
                    init.addZero(mm + 1) +
                    '-' +
                    init.addZero(countDay + 1);
                trtd += '<td class="day';
                trtd +=
                    markToday && markToday === countDay + 1 ? ' today ' : '';
                trtd += scheduleContainer[fullDate] ? ' save"' : '"';
                trtd += ` data-date="${
                    countDay + 1
                }" data-fdate="${fullDate}">`;
            }
            trtd += startCount ? ++countDay : '';
            if (countDay === lastDay.getDate()) {
                startCount = 0;
            }
            trtd += '</td>';
        }
        trtd += '</tr>';
    }
    $calBody.innerHTML = trtd;
}

function initToday() {
    const fdate =
        init.today.getFullYear() +
        '-' +
        init.addZero(init.today.getMonth() + 1) +
        '-' +
        init.addZero(init.today.getDate());
    renderDiaryContent(scheduleContainer[fdate]);
}

/**
 * @param {string} val
 */
function createNewList(val) {
    let id = new Date().getTime() + '';
    let yy = init.activeDate.getFullYear();
    let mm = init.activeDate.getMonth() + 1;
    let dd = init.activeDate.getDate();
    const $target = $calBody.querySelector(`.day[data-date="${dd}"]`);

    let date = yy + '-' + init.addZero(mm) + '-' + init.addZero(dd);

    let eventData = {};
    eventData['date'] = date;
    eventData['memo'] = val;
    eventData['complete'] = false;
    eventData['id'] = id;
    init.event.push(eventData);
    $todoList.appendChild(createLi(id, val, date));
}

function renderDiaryContent(diary) {
    if (diary) {
        document.querySelector('#title').innerHTML = diary.title;
        document.querySelector('.ql-editor').innerHTML = diary.content;
    } else {
        document.querySelector('#title').innerHTML = '아무 소식이 없네요!';
        document.querySelector('.ql-editor').innerHTML =
            '오늘은 저희 농장이 쉬고 가네요!';
    }
}

$btnNext.addEventListener('click', () => loadYYMM(init.nextMonth()));
$btnPrev.addEventListener('click', () => loadYYMM(init.prevMonth()));

$calBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
        if (init.activeDTag) {
            init.activeDTag.classList.remove('day-active');
        }
        let day = Number(e.target.textContent);
        loadDate(day, e.target.cellIndex);

        e.target.classList.add('day-active');
        init.activeDTag = e.target;
        init.activeDate.setDate(day);

        renderDiaryContent(scheduleContainer[e.target.dataset.fdate]);
    }
});

// 날짜 및 다이어리 내용 가져오기
const scheduleContainer = {};
axios({
    method: 'GET',
    url: '/diary/api',
    responseType: 'json',
}).then(function (res) {
    const dataContain = res.data;

    if (dataContain) {
        dataContain.forEach((data) => {
            const dateObject = new Date(data.date);
            const date =
                dateObject.getFullYear() +
                '-' +
                init.addZero(dateObject.getMonth() + 1) +
                '-' +
                init.addZero(dateObject.getDate());
            scheduleContainer[date] = {
                title: data.title,
                content: data.content,
            };
        });
    }

    loadYYMM(init.today);
    loadDate(init.today.getDate(), init.today.getDay());
    initToday();
});
// 날짜 및 다이어리 내용 가져오기
