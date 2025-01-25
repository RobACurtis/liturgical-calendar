const $monthTitle = document.querySelector('.month-title');
const $journalPage = document.querySelector('#journalPage');
const $calendarPage = document.querySelector('#calendar-page');
const $modal = document.querySelector('#modal');
$modal.addEventListener('click', removeItem);
const $leftarrow = document.querySelector('.fa-arrow-left');
const $rightarrow = document.querySelector('.fa-arrow-right');
const $loading = document.querySelector('#loading');
$journalPage.addEventListener('input', addPhoto);
$journalPage.addEventListener('submit', addEntry);
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
  xhrMonth.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/' + year + '/' + month);
  xhrMonth.setRequestHeader('token', 'abc123');
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

function addPhoto(event) {
  if (event.target.name !== 'photoURL') {
    return;
  }
  const $photo = $journalPage.children[0].children[0].children[0].children[1];
  const src = event.target.value;
  $photo.setAttribute('src', src);
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

  if (data.entries.length !== 0) {
    for (let i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === (currentMonthNum + '-' + id + '-' + year)) {
        const $divRow1 = document.createElement('div');
        $divRow1.className = 'row center';
        $divRow1.setAttribute('id', 'journal');
        $divContainer.appendChild($divRow1);

        const $divCol1 = document.createElement('div');
        $divCol1.className = 'column-full column-three-four center';
        $divRow1.appendChild($divCol1);

        const $p3 = document.createElement('p');
        $p3.textContent = data.entries[i].notes;
        $p3.className = 'notes';
        $divCol1.appendChild($p3);
        $img.setAttribute('src', data.entries[i].imageUrl);

        const $subtextDivRow = document.createElement('div');
        $subtextDivRow.className = 'row';
        $subtextDivRow.setAttribute('id', 'details');
        $divContainer.appendChild($subtextDivRow);

        const $subtextDiv = document.createElement('div');
        $subtextDiv.className = 'column-quarter subtext subtext-form';
        $subtextDiv.setAttribute('id', 'details');
        $subtextDivRow.appendChild($subtextDiv);

        const $edit = document.createElement('i');
        $edit.className = 'fas fa-pen-square';
        $edit.setAttribute('type', 'image');
        $edit.addEventListener('click', editEntry);
        $subtextDivRow.appendChild($edit);

        const $year = document.createElement('p');
        $year.className = 'year';
        $year.textContent = 'Year: A';
        $subtextDiv.appendChild($year);

        const $lectionaryYear = document.createElement('p');
        $lectionaryYear.className = 'lectionary-year';
        $lectionaryYear.textContent = 'Weekdays: I';
        $subtextDiv.appendChild($lectionaryYear);

        color = data.entries[i].color;
        const colorCase = color.charAt(0).toUpperCase() + color.slice(1);

        const $color = document.createElement('p');
        $color.className = 'liturgical-color';
        $color.textContent = 'Color: ' + colorCase;
        $subtextDiv.appendChild($color);

        return $divContainer;
      }
    }
  }
  const $divForm = document.createElement('div');
  $divForm.className = 'row center rel';
  $divContainer.appendChild($divForm);

  const $form = document.createElement('form');
  $divForm.appendChild($form);

  const $divForm1 = document.createElement('div');
  $divForm1.className = 'column-full';
  $form.appendChild($divForm1);

  const $textArea = document.createElement('textarea');
  $textArea.setAttribute('name', 'entry');
  $textArea.setAttribute('id', 'entry');
  $textArea.setAttribute('class', 'text-area');
  $textArea.setAttribute('placeholder', 'Notes..');
  $textArea.setAttribute('autocomplete', 'off');
  $divForm1.appendChild($textArea);

  const $divForm2 = document.createElement('div');
  $divForm2.className = 'column-full rel';
  $form.appendChild($divForm2);

  const $input = document.createElement('input');
  $input.setAttribute('type', 'text');
  $input.setAttribute('class', 'photo-input');
  $input.setAttribute('name', 'photoURL');
  $input.setAttribute('placeholder', 'Upload Photo URL');
  $input.setAttribute('autocomplete', 'off');
  $divForm2.appendChild($input);

  const $button = document.createElement('button');
  $button.className = 'submit-button';
  $divForm2.appendChild($button);

  const $submit = document.createElement('img');
  $submit.className = 'submit-img';
  $submit.setAttribute('src', 'images/submit.png');
  $submit.setAttribute('type', 'image');
  $button.appendChild($submit);

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

  color = obj.celebrations[0].colour;
  const colorCase = color.charAt(0).toUpperCase() + color.slice(1);

  const $color = document.createElement('p');
  $color.className = 'liturgical-color';
  $color.textContent = 'Color: ' + colorCase;
  $subtextDiv.appendChild($color);

  return $divContainer;
}

function addEntry(event) {
  event.preventDefault();
  const $notes = event.target.querySelector('.text-area');
  const $photoUrl = event.target.querySelector('.photo-input');
  if (data.editing !== null) {
    for (let i = 0; i < data.entries.length; i++) {
      if (data.editing.id === data.entries[i].id) {
        data.entries[i] = {
          id: currentMonthNum + '-' + id + '-' + year,
          color: color,
          imageUrl: $photoUrl.value,
          notes: $notes.value
        };
        var $newEntry = singleCalendarPage(xhrMonth.response[id]);
        $journalPage.children[0].replaceWith($newEntry);
        data.editing = null;
        return;
      }
    }
  }
  const inputObj = {
    id: currentMonthNum + '-' + id + '-' + year,
    color: color,
    imageUrl: $photoUrl.value,
    notes: $notes.value
  };
  data.entries.unshift(inputObj);
  $newEntry = singleCalendarPage(xhrMonth.response[id]);
  $journalPage.children[0].replaceWith($newEntry);
}

function editEntry(event) {
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i].id === (currentMonthNum + '-' + id + '-' + year)) {
      data.editing = Object.assign({}, data.entries[i]);
    }
  }

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
  $p.textContent = xhrMonth.response[id].celebrations[0].title;
  $divCol.appendChild($p);

  const $img = document.createElement('img');
  $img.setAttribute('src', data.editing.imageUrl);
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

  const $divForm = document.createElement('div');
  $divForm.className = 'row center rel';
  $divContainer.appendChild($divForm);

  const $form = document.createElement('form');
  $divForm.appendChild($form);

  const $divForm1 = document.createElement('div');
  $divForm1.className = 'column-full';
  $form.appendChild($divForm1);

  const $textArea = document.createElement('textarea');
  $textArea.setAttribute('name', 'entry');
  $textArea.setAttribute('id', 'entry');
  $textArea.setAttribute('class', 'text-area');
  $textArea.setAttribute('placeholder', 'Notes..');
  $textArea.setAttribute('autocomplete', 'off');
  $textArea.value = data.editing.notes;
  $divForm1.appendChild($textArea);

  const $divForm2 = document.createElement('div');
  $divForm2.className = 'column-full rel';
  $form.appendChild($divForm2);

  const $input = document.createElement('input');
  $input.value = data.editing.imageUrl;
  $input.setAttribute('type', 'text');
  $input.setAttribute('class', 'photo-input');
  $input.setAttribute('name', 'photoURL');
  $input.setAttribute('placeholder', 'Upload Photo URL');
  $input.setAttribute('autocomplete', 'off');
  $divForm2.appendChild($input);

  const $delete = document.createElement('button');
  $delete.textContent = 'Delete';
  $delete.className = 'delete';
  $delete.setAttribute('type', 'button');
  $delete.setAttribute('id', 'deleteEntry');
  $delete.addEventListener('click', displayModal);
  $divForm2.appendChild($delete);

  const $button = document.createElement('button');
  $button.className = 'submit-button';
  $divForm2.appendChild($button);

  const $submit = document.createElement('img');
  $submit.className = 'submit-img';
  $submit.setAttribute('src', 'images/submit.png');
  $submit.setAttribute('type', 'image');
  $button.appendChild($submit);

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

  color = xhrMonth.response[id].celebrations[0].colour;
  const colorCase = color.charAt(0).toUpperCase() + color.slice(1);

  const $color = document.createElement('p');
  $color.className = 'liturgical-color';
  $color.textContent = 'Color: ' + colorCase;
  $subtextDiv.appendChild($color);

  $journalPage.children[0].replaceWith($divContainer);
}

function removeItem(event) {
  if (event.target.id === 'cancel') {
    $modal.innerHTML = '';
    return;
  } if (event.target.id === 'delete') {
    for (let i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === currentMonthNum + '-' + id + '-' + year) {
        data.entries.splice(i, 1);
      }
      const $newPage = singleCalendarPage(xhrMonth.response[id]);
      $journalPage.children[0].replaceWith($newPage);
      $modal.innerHTML = '';
      data.editing = null;
    }
  }
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
