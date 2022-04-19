var $week = document.querySelector('p.week');
var $date = document.querySelector('p.date');
var numericDate = null;
var $year = document.querySelector('p.year');
var $color = document.querySelector('p.liturgical-color');
var $seasonWeek = document.querySelector('p.lectionary-year');
var $day = document.querySelector('p.day');
var $journalEntry = document.querySelector('p.notes');

var $form = document.querySelector('form');
var $photoInput = document.querySelector('.photo-input');
var $photo = document.querySelector('img');

$photoInput.addEventListener('input', addPhoto);
$form.addEventListener('submit', addEntry);

function addEntry(event) {
  event.preventDefault();
  var text = $form.elements.entry.value;
  var inputObj = {
    title: numericDate,
    imageUrl: text,
    notes: $form.elements.entry.value,
    entryId: data.nextEntryId
  };
  data.nextEntryId++;
  data.entries.unshift(inputObj);
  $form.className = 'hidden';
  $journalEntry.textContent = text;
  console.log(data);
}

function addPhoto(event) {
  var src = $photoInput.value;
  $photo.setAttribute('src', src);
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today');
xhr.responseType = 'json';

var xhrYear = new XMLHttpRequest();
xhrYear.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/2022');
xhrYear.responseType = 'json';

xhr.addEventListener('load', function () {
  var weekday = xhr.response.weekday;
  var day = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  var color = xhr.response.celebrations[0].colour;
  var colorCase = color.charAt(0).toUpperCase() + color.slice(1);

  numericDate = xhr.response.date;
  var month = numericDate.split('-');
  var month1 = '';

  if (month[1] === '01') {
    month1 = 'January';
  } else if (month[1] === '02') {
    month1 = 'February';
  } else if (month[1] === '03') {
    month1 = 'March';
  } else if (month[1] === '04') {
    month1 = 'April';
  } else if (month[1] === '05') {
    month1 = 'May';
  } else if (month[1] === '06') {
    month1 = 'June';
  } else if (month[1] === '07') {
    month1 = 'July';
  } else if (month[1] === '08') {
    month1 = 'August';
  } else if (month[1] === '09') {
    month1 = 'September';
  } else if (month[1] === '10') {
    month1 = 'October';
  } else if (month[1] === '11') {
    month1 = 'November';
  } else if (month[1] === '12') {
    month1 = 'December';
  }

  $day.textContent = day;
  $week.textContent = xhr.response.celebrations[0].title;
  $date.textContent = month1 + ' ' + xhr.response.date[8] + xhr.response.date[9] + ', 2022';
  $color.textContent = 'Color: ' + colorCase;
});

xhrYear.addEventListener('load', function () {
  $year.textContent = 'Year ' + xhrYear.response.lectionary;
  $seasonWeek.textContent = 'Lectionary Week: ' + xhrYear.response.ferial_lectionary;
});

xhrYear.send();
xhr.send();
