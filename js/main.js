const $monthTitle = document.querySelector('.month-title');
const $journalPage = document.querySelector('#journalPage');
const $calendarPage = document.querySelector('#calendar-page');
const $modal = document.querySelector('#modal');
const $leftarrow = document.querySelector('.fa-arrow-left');
const $rightarrow = document.querySelector('.fa-arrow-right');
const $loading = document.querySelector('#loading');
const $header = document.querySelector('header');
$header.addEventListener('click', viewSwap);

const $calendar = document.querySelector('#calendar');
$calendar.addEventListener('click', showDate);

const weekDayArr = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
const months = [
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
  'December'
];
const date = new Date();
const weekDay = weekDayArr[date.getDay()];
const dateNum = date.getDate();
const dateMonth = months[date.getMonth()];
const dateMonthNum = date.getMonth() + 1;
let year = date.getFullYear();

let id = '';
let currentMonthNum = null;
let currentMonth = '';
let color = '';

function getCalendarData(month) {
  $loading.className = '';
  const xhrMonth = new XMLHttpRequest();
  xhrMonth.open('GET', 'https://calendar-api.graceoftherosary.com/api/v0/en/calendars/default/' + year + '/' + month);
  xhrMonth.responseType = 'json';
  xhrMonth.addEventListener('error', function () {
    const $failToLoadPage = document.querySelector('.failed-page');
    $failToLoadPage.className = 'failed-page';
  });
  xhrMonth.addEventListener('load', renderMonth);
  xhrMonth.send();
  return xhrMonth;
}

let xhrMonth = getCalendarData(dateMonthNum);

function getCalendarMonth(numericDate) {
  const months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };
  const monthDate = numericDate.split('-');
  currentMonth = months[monthDate[1]];
  currentMonthNum = parseInt(monthDate[1], 10);
  return currentMonth;
}

function renderMonth() {
  const monthArr = xhrMonth.response;
  currentMonth = getCalendarMonth(xhrMonth.response[0].date);
  $monthTitle.textContent = currentMonth;
  const $calMonth = document.querySelector('#calendar-month');
  $calMonth.textContent = '';
  const $divCol1 = document.createElement('div');
  $divCol1.className = 'column-full center';
  $calMonth.appendChild($divCol1);
  const $pCalDate = document.createElement('p');
  $pCalDate.className = 'calendar-date';
  if (dateMonthNum === currentMonthNum) {
    $pCalDate.textContent = weekDay + ' ' + dateMonth + ' ' + dateNum + ', ' + year;
  } else {
    $pCalDate.textContent = currentMonth + ' ' + year;
  }
  $divCol1.appendChild($pCalDate);

  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const $divDay = document.querySelector('#day');
  $divDay.textContent = '';
  const $divWeekday = document.querySelector('#weekday');
  $divWeekday.textContent = '';
  for (let i = 0; i < days.length; i++) {
    const $p = document.createElement('p');
    $p.className = 'day';
    $p.textContent = days[i];
    if (i < 7) {
      $divDay.appendChild($p);
    } else {
      $divWeekday.appendChild($p);
    }
  }
  $calendar.textContent = '';
  let emptyDays = 0;
  if (monthArr[0].weekday !== 'sunday') {
    if (monthArr[0].weekday === 'monday') {
      emptyDays = 1;
    } if (monthArr[0].weekday === 'tuesday') {
      emptyDays = 2;
    }
    if (monthArr[0].weekday === 'wednesday') {
      emptyDays = 3;
    }
    if (monthArr[0].weekday === 'thursday') {
      emptyDays = 4;
    }
    if (monthArr[0].weekday === 'friday') {
      emptyDays = 5;
    }
    if (monthArr[0].weekday === 'saturday') {
      emptyDays = 6;
    }
    for (let i = 0; i < emptyDays; i++) {
      const $p = document.createElement('p');
      $p.className = 'hidden-cal';
      $calendar.appendChild($p);
    }
  }
  const $feastDayList = document.querySelector('ul.feast-days');
  $feastDayList.textContent = '';

  for (let i = 0; i < monthArr.length; i++) {
    if (i + 1 === dateNum && dateMonthNum === currentMonthNum) {
      var $singleCalendarDate = document.createElement('a');
      $singleCalendarDate.setAttribute('id', currentMonthNum + '-' + i + '-' + year);
      $singleCalendarDate.className = 'cal rel current-cal-day';
      $singleCalendarDate.textContent = i + 1;
      $calendar.appendChild($singleCalendarDate);
    } else {
      $singleCalendarDate = document.createElement('a');
      $singleCalendarDate.setAttribute('id', currentMonthNum + '-' + i + '-' + year);
      $singleCalendarDate.className = 'cal rel';
      $singleCalendarDate.textContent = i + 1;
      $calendar.appendChild($singleCalendarDate);
    }

    if (monthArr[i].celebrations[0].rank_num <= 2.8) {
      const weekday = monthArr[i].weekday.charAt(0).toUpperCase() + monthArr[i].weekday.slice(1);
      const $span = document.createElement('span');
      $span.textContent = monthArr[i].celebrations[0].title;
      $singleCalendarDate.appendChild($span);
      const $li = document.createElement('li');
      $li.textContent = weekday + ' ' + currentMonth + ' ' + (i + 1) + ', ' + monthArr[i].celebrations[0].title;
      $feastDayList.appendChild($li);
    }
  }
  const lastItem = monthArr.length - 1;

  if (monthArr[lastItem].weekday !== 'saturday') {
    if (monthArr[lastItem].weekday === 'friday') {
      emptyDays = 1;
    } if (monthArr[lastItem].weekday === 'thursday') {
      emptyDays = 2;
    }
    if (monthArr[lastItem].weekday === 'wednesday') {
      emptyDays = 3;
    }
    if (monthArr[lastItem].weekday === 'tuesday') {
      emptyDays = 4;
    }
    if (monthArr[lastItem].weekday === 'monday') {
      emptyDays = 5;
    }
    if (monthArr[lastItem].weekday === 'sunday') {
      emptyDays = 6;
    }
    for (let i = 0; i < emptyDays; i++) {
      const $p = document.createElement('p');
      $p.className = 'hidden-cal';
      $calendar.appendChild($p);
    }
  }
  $loading.className = 'hidden';
}

function viewSwap(event) {
  if ($calendarPage.className === 'hidden' && event.target.className === 'fas fa-arrow-left') {
    $journalPage.innerHTML = '';
    $rightarrow.className = 'fas fa-arrow-right';
    $calendarPage.className = 'container background-color rel margin-top padding-bottom';
    data.editing = null;
    return;
  }
  if ($calendarPage.className !== 'hidden' && event.target.className === 'fas fa-arrow-left') {
    currentMonthNum -= 1;
    if (currentMonthNum < 1) {
      year -= 1;
      currentMonthNum = 12;
    }
    xhrMonth = getCalendarData(currentMonthNum);
  }
  if ($calendarPage.className !== 'hidden' && event.target.className === 'fas fa-arrow-right') {
    currentMonthNum += 1;
    if (currentMonthNum > 12) {
      currentMonthNum = 1;
      year += 1;
    }
    xhrMonth = getCalendarData(currentMonthNum);
  }
}

function renderJournalPageDOM(obj) {
  const journalPage = singleCalendarPage(obj);
  $journalPage.appendChild(journalPage);
  $calendarPage.className = 'hidden';
  $leftarrow.className = 'fas fa-arrow-left';
  $rightarrow.className = 'hidden';
  return journalPage;
}

function showDate(event) {
  if (event.target.closest('a') === null) return;
  id = event.target.closest('a').id;
  const split = id.split('-');
  id = parseInt(split[1]);
  const obj = xhrMonth.response[id];
  renderJournalPageDOM(obj);
}

function singleCalendarPage(obj) {
  const $divContainer = document.createElement('div');
  $divContainer.className = 'container background-color rel';

  const $divRow = document.createElement('div');
  $divRow.className = 'row center';
  $divContainer.appendChild($divRow);

  const $divCol = document.createElement('div');
  $divCol.className = 'column-full column-three-four center';
  $divRow.appendChild($divCol);

  const $p = document.createElement('p');
  $p.className = 'week';
  $p.textContent = obj.celebrations[0].title;
  $divCol.appendChild($p);

  const $img = document.createElement('img');
  $img.setAttribute('src', 'images/good-shepherd.jpg');
  $img.setAttribute('id', 'photo');
  $img.setAttribute('alt', 'Jesus The Good Shepherd');
  $img.setAttribute('onerror', "this.src = 'images/good-shepherd.jpg'");
  $divCol.appendChild($img);

  const $p1 = document.createElement('p');
  $p1.className = 'date';
  if (xhrMonth.response[id].date[8] === '0') {
    $p1.textContent = currentMonth + ' ' + xhrMonth.response[id].date[9] + ', ' + year;
  } else {
    $p1.textContent = currentMonth + ' ' + xhrMonth.response[id].date[8] + xhrMonth.response[id].date[9] + ', ' + year;
  }
  $divCol.appendChild($p1);

  const $subtextDivRow = document.createElement('div');
  $subtextDivRow.className = 'row';
  $subtextDivRow.setAttribute('id', 'details');
  $divContainer.appendChild($subtextDivRow);

  const $subtextDiv = document.createElement('div');
  $subtextDiv.className = 'column-quarter subtext subtext-form';
  $subtextDiv.setAttribute('id', 'details');
  $subtextDivRow.appendChild($subtextDiv);

  const $year = document.createElement('p');
  $year.className = 'year';
  $year.textContent = 'Year: A';
  $subtextDiv.appendChild($year);
  const $lectionaryYear = document.createElement('p');
  $lectionaryYear.className = 'lectionary-year';
  $lectionaryYear.textContent = 'Weekdays: I';
  $subtextDiv.appendChild($lectionaryYear);

  const $lectionaryYearSundays = document.createElement('p');
 $lectionaryYearSundays.className = 'lectionary-year';
 $lectionaryYearSundays.textContent = 'Sundays: C';
  $subtextDiv.appendChild($lectionaryYearSundays);

  color = obj.celebrations[0].colour;
  const colorCase = color.charAt(0).toUpperCase() + color.slice(1);

  const $color = document.createElement('p');
  $color.className = 'liturgical-color';
  $color.textContent = 'Color: ' + colorCase;
  $subtextDiv.appendChild($color);

  return $divContainer;
}

function displayModal(event) {
  $modal.className = '';
  const $div1 = document.createElement('div');
  $div1.className = 'background';
  $modal.appendChild($div1);

  const $div2 = document.createElement('div');
  $div2.className = 'modal-container center';
  $div1.appendChild($div2);

  const $div3 = document.createElement('div');
  $div3.className = 'row flex-wrap modal-width';
  $div2.appendChild($div3);

  const $div4 = document.createElement('div');
  $div4.className = 'column-full';
  $div3.appendChild($div4);

  const $heading = document.createElement('h5');
  $heading.textContent = 'Delete Entry?';
  $heading.className = 'modal-title';
  $div4.appendChild($heading);

  const $div5 = document.createElement('div');
  $div5.className = 'column-full buttons';
  $div3.appendChild($div5);

  const $cancelButton = document.createElement('button');
  $cancelButton.className = 'cancel-modal';
  $cancelButton.setAttribute('id', 'cancel');
  $cancelButton.textContent = 'Cancel';
  $div5.appendChild($cancelButton);
  const $deleteButton = document.createElement('button');
  $deleteButton.className = 'delete-modal';
  $deleteButton.setAttribute('id', 'delete');
  $deleteButton.textContent = 'Delete';
  $div5.appendChild($deleteButton);
}
