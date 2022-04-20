var $titleDay = document.querySelector('.title-day');
var $journalPage = document.querySelector('#journalPage');
var $week = document.querySelector('p.week');
var $photo = document.querySelector('#photo');
var $date = document.querySelector('p.date');
var $journalEntry = document.querySelector('#journal');
var $form = document.querySelector('form');
var $photoInput = document.querySelector('.photo-input');
var $calendarPage = document.querySelector('#calendar-page');
var $subtext = document.querySelector('#details');
var $year = document.querySelector('p.year');
var $seasonWeek = document.querySelector('p.lectionary-year');
var $color = document.querySelector('p.liturgical-color');

var $calendar = document.querySelector('#calendar');
var $feastDayList = document.querySelector('ul.feast-days');
var $calDate = document.querySelector('.calendar-date');
var $leftArrow = document.querySelector('.fa-arrow-left');
$leftArrow.addEventListener('click', viewSwap);

var title = '';

function viewSwap(event) {
  $journalPage.className = 'hidden';
  $calendarPage.className = 'container background-color rel margin-top padding-bottom';
  $leftArrow.className = 'hidden';
}

$calendar.addEventListener('click', showDate);
var id = '';
function showDate(event) {
  console.log(event.target.closest('p'));
  id = event.target.closest('p');
  console.log(id);
}

$photoInput.addEventListener('input', addPhoto);
$form.addEventListener('submit', addEntry);

var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today');
xhr.responseType = 'json';

var xhrMonth = new XMLHttpRequest();
xhrMonth.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/2022/4');
xhrMonth.responseType = 'json';

var xhrYear = new XMLHttpRequest();
xhrYear.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/2022');
xhrYear.responseType = 'json';

xhrMonth.addEventListener('load', renderMonth);
xhr.addEventListener('load', renderDate);
xhrYear.addEventListener('load', function () {
  $year.textContent = 'Year ' + xhrYear.response.lectionary;
  $seasonWeek.textContent = 'Lectionary Week: ' + xhrYear.response.ferial_lectionary;
});

xhrMonth.send();
xhrYear.send();
xhr.send();

function renderMonth() {
  var month = xhrMonth.response;
  var emptyDays = 0;
  var date = xhrMonth.response[0].date;
  var currentMonth = getMonth(date);
  if (month[0].weekday !== 'sunday') {
    if (month[0].weekday === 'monday') {
      emptyDays = 1;
    } if (month[0].weekday === 'tuesday') {
      emptyDays = 2;
    }
    if (month[0].weekday === 'wednesday') {
      emptyDays = 3;
    }
    if (month[0].weekday === 'thursday') {
      emptyDays = 4;
    }
    if (month[0].weekday === 'friday') {
      emptyDays = 5;
    }
    if (month[0].weekday === 'saturday') {
      emptyDays = 6;
    }
    for (var i = 0; i < emptyDays; i++) {
      var $p = document.createElement('p');
      $p.className = 'hidden-cal';
      $calendar.appendChild($p);
    }
  }
  $calDate.textContent = currentMonth + ' 2022';
  $titleDay.textContent = currentMonth;
  for (i = 0; i < month.length; i++) {
    $p = document.createElement('p');
    var num = i + 1;
    if (num < 10) {
      $p.setAttribute('id', '0' + num);
    } else {
      $p.setAttribute('id', num);
    }
    $p.className = 'cal rel';
    $p.textContent = month[i].date[8] + month[i].date[9];
    $calendar.appendChild($p);
    if (month[i].celebrations[0].rank_num <= 2.8) {
      var weekday = month[i].weekday;
      var day = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      var $span = document.createElement('span');
      $span.textContent = month[i].celebrations[0].title;
      $p.appendChild($span);
      var $li = document.createElement('li');
      $li.textContent = day + ' ' + currentMonth + ' ' + month[i].date[8] + month[i].date[9] + ', ' + month[i].celebrations[0].title;
      $feastDayList.appendChild($li);
    }
  }
  var lastItem = month.length - 1;
  if (month[lastItem].weekday !== 'saturday') {
    if (month[lastItem].weekday === 'friday') {
      emptyDays = 1;
    } if (month[lastItem].weekday === 'thursday') {
      emptyDays = 2;
    }
    if (month[lastItem].weekday === 'wednesday') {
      emptyDays = 3;
    }
    if (month[lastItem].weekday === 'tuesday') {
      emptyDays = 4;
    }
    if (month[lastItem].weekday === 'monday') {
      emptyDays = 5;
    }
    if (month[lastItem].weekday === 'sunday') {
      emptyDays = 6;
    }
    for (i = 0; i < emptyDays; i++) {
      $p = document.createElement('p');
      $p.className = 'hidden-cal';
      $calendar.appendChild($p);
    }
  }
}

function renderDate() {
  var date = xhr.response.date;
  var month = getMonth(date);
  var color = xhr.response.celebrations[0].colour;
  var colorCase = color.charAt(0).toUpperCase() + color.slice(1);
  $week.textContent = xhr.response.celebrations[0].title;
  $date.textContent = month + ' ' + xhr.response.date[8] + xhr.response.date[9] + ', 2022';
  $color.textContent = 'Color: ' + colorCase;
  title = xhr.response.celebrations[0].title;
  renderJournalPage();
}

function addPhoto(event) {
  var src = $photoInput.value;
  $photo.setAttribute('src', src);
}

function addEntry(event) {
  event.preventDefault();
  var inputObj = {
    title: title,
    imageUrl: $form.elements.photoURL.value,
    notes: $form.elements.entry.value,
    entryId: data.nextEntryId
  };
  data.nextEntryId++;
  data.entries.unshift(inputObj);
  var $newEntry = renderEntry();
  $journalEntry.children[0].appendChild($newEntry);
}

function renderEntry() {
  $form.className = 'hidden';
  $journalEntry.className = 'row center';
  var $p = document.createElement('p');
  $p.textContent = data.entries[0].notes;
  $p.className = 'notes';
  $photo.setAttribute('src', data.entries[0].imageUrl);
  $subtext.className = 'column-quarter subtext subtext-entry';
  return $p;
}

function renderJournalPage(event) {
  for (var i = 0; i < data.entries.length; i++) {
    if (title === data.entries[i].title) {
      $journalEntry.className = 'row center';
      $form.className = 'hidden';
      var $p = renderEntry();
      $journalEntry.children[0].appendChild($p);
      $photo.setAttribute('src', data.entries[i].imageUrl);
      $subtext.className = 'column-quarter subtext subtext-entry';
      break;
    }
  }
}

function getMonth(date) {
  var monthDate = date.split('-');
  var currentMonth = '';
  if (monthDate[1] === '01') {
    currentMonth = 'January';
  } else if (monthDate[1] === '02') {
    currentMonth = 'February';
  } else if (monthDate[1] === '03') {
    currentMonth = 'March';
  } else if (monthDate[1] === '04') {
    currentMonth = 'April';
  } else if (monthDate[1] === '05') {
    currentMonth = 'May';
  } else if (monthDate[1] === '06') {
    currentMonth = 'June';
  } else if (monthDate[1] === '07') {
    currentMonth = 'July';
  } else if (monthDate[1] === '08') {
    currentMonth = 'August';
  } else if (monthDate[1] === '09') {
    currentMonth = 'September';
  } else if (monthDate[1] === '10') {
    currentMonth = 'October';
  } else if (monthDate[1] === '11') {
    currentMonth = 'November';
  } else if (monthDate[1] === '12') {
    currentMonth = 'December';
  }
  return currentMonth;
}
