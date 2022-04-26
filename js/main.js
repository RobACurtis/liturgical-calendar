var $monthTitle = document.querySelector('.month-title');
var $journalPage = document.querySelector('#journalPage');
var $calendarPage = document.querySelector('#calendar-page');
var $modal = document.querySelector('#modal');
$modal.addEventListener('click', removeItem);
var $loading = document.querySelector('#loading');
$journalPage.addEventListener('input', addPhoto);
$journalPage.addEventListener('submit', addEntry);

var $calendar = document.querySelector('#calendar');
$calendar.addEventListener('click', showDate);

var $pageToCalendar = document.querySelector('.fa-arrow-left');
$pageToCalendar.addEventListener('click', showCalendar);

var id = '';
var date = '';
var currentMonth = '';
var color = '';

function getCalendarData(month) {
  var targetUrl = encodeURIComponent('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/2022/');
  $loading.className = '';
  var xhrMonth = new XMLHttpRequest();
  xhrMonth.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl + month);
  xhrMonth.setRequestHeader('token', 'abc123');
  xhrMonth.responseType = 'json';
  xhrMonth.addEventListener('error', function () {
    var $failToLoadPage = document.querySelector('.failed-page');
    $failToLoadPage.className = 'failed-page';
  });
  xhrMonth.addEventListener('load', renderMonth);
  xhrMonth.send();
  return xhrMonth;
}

var xhrMonth = getCalendarData(4);

function showCalendar(event) {
  $journalPage.innerHTML = '';
  $calendarPage.className = 'container background-color rel margin-top padding-bottom';
  $pageToCalendar.className = 'hidden';
  data.editing = null;
}

function addPhoto(event) {
  if (event.target.name !== 'photoURL') {
    return;
  }
  var $photo = $journalPage.children[0].children[0].children[0].children[1];
  var src = event.target.value;
  $photo.setAttribute('src', src);
}

function renderJournalPageDOM(obj) {
  var journalPage = createDomTree(obj);
  $journalPage.appendChild(journalPage);
  $calendarPage.className = 'hidden';
  $pageToCalendar.className = 'fas fa-arrow-left';
  return journalPage;
}

function renderMonth() {
  var monthArr = xhrMonth.response;
  date = xhrMonth.response[0].date;
  currentMonth = getMonth(date);
  $monthTitle.textContent = currentMonth;

  var $calMonth = document.querySelector('#calendar-month');
  var $divCol1 = document.createElement('div');
  $divCol1.className = 'column-full center';
  $calMonth.appendChild($divCol1);
  var $pCalDate = document.createElement('p');
  $pCalDate.className = 'calendar-date';
  $pCalDate.textContent = currentMonth + ' 2022';
  $divCol1.appendChild($pCalDate);

  var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var $divDay = document.querySelector('#day');
  var $divWeekday = document.querySelector('#weekday');
  for (var i = 0; i < days.length; i++) {
    var $p = document.createElement('p');
    $p.className = 'day';
    $p.textContent = days[i];
    if (i < 7) {
      $divDay.appendChild($p);
    } else {
      $divWeekday.appendChild($p);
    }
  }
  var emptyDays = 0;
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
    for (i = 0; i < emptyDays; i++) {
      $p = document.createElement('p');
      $p.className = 'hidden-cal';
      $calendar.appendChild($p);
    }
  }

  var $feastDayList = document.querySelector('ul.feast-days');
  for (i = 0; i < monthArr.length; i++) {
    $p = document.createElement('p');
    $p.setAttribute('id', i);
    $p.className = 'cal rel';
    $p.textContent = i + 1;
    $calendar.appendChild($p);

    if (monthArr[i].celebrations[0].rank_num <= 2.8) {
      var weekday = monthArr[i].weekday.charAt(0).toUpperCase() + monthArr[i].weekday.slice(1);
      var $span = document.createElement('span');
      $span.textContent = monthArr[i].celebrations[0].title;
      $p.appendChild($span);
      var $li = document.createElement('li');
      $li.textContent = weekday + ' ' + currentMonth + ' ' + (i + 1) + ', ' + monthArr[i].celebrations[0].title;
      $feastDayList.appendChild($li);
    }
  }
  var lastItem = monthArr.length - 1;
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
    for (i = 0; i < emptyDays; i++) {
      $p = document.createElement('p');
      $p.className = 'hidden-cal';
      $calendar.appendChild($p);
    }
  }
  $loading.className = 'hidden';
}

function addEntry(event) {
  event.preventDefault();
  var $notes = event.target.querySelector('.text-area');
  var $photoUrl = event.target.querySelector('.photo-input');
  if (data.editing !== null) {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.editing.id === data.entries[i].id) {
        data.entries[i] = {
          id: id,
          color: color,
          imageUrl: $photoUrl.value,
          notes: $notes.value
        };
        var $newEntry = createDomTree(xhrMonth.response[id]);
        $journalPage.children[0].replaceWith($newEntry);
        data.editing = null;
        return;
      }
    }
  }
  var inputObj = {
    id: id,
    color: color,
    imageUrl: $photoUrl.value,
    notes: $notes.value
  };
  data.entries.unshift(inputObj);
  $newEntry = createDomTree(xhrMonth.response[id]);
  $journalPage.children[0].replaceWith($newEntry);
}

function editEntry(event) {
  for (var i = 0; i < data.entries.length; i++) {
    if (data.entries[i].id === id) {
      data.editing = Object.assign({}, data.entries[i]);
    }
  }

  var $divContainer = document.createElement('div');
  $divContainer.className = 'container background-color rel';

  var $divRow = document.createElement('div');
  $divRow.className = 'row center';
  $divContainer.appendChild($divRow);

  var $divCol = document.createElement('div');
  $divCol.className = 'column-full column-three-four center';
  $divRow.appendChild($divCol);

  var $p = document.createElement('p');
  $p.className = 'week';
  $p.textContent = xhrMonth.response[id].celebrations[0].title;
  $divCol.appendChild($p);

  var $img = document.createElement('img');
  $img.setAttribute('src', data.editing.imageUrl);
  $img.setAttribute('id', 'photo');
  $img.setAttribute('alt', 'Jesus The Good Shepherd');
  $img.setAttribute('onerror', "this.src = 'images/good-shepherd.jpg'");
  $divCol.appendChild($img);

  var $p1 = document.createElement('p');
  $p1.className = 'date';
  $p1.textContent = currentMonth + ' ' + xhrMonth.response[id].date[8] + xhrMonth.response[id].date[9] + ', 2022';
  $divCol.appendChild($p1);

  var $divForm = document.createElement('div');
  $divForm.className = 'row center rel';
  $divContainer.appendChild($divForm);

  var $form = document.createElement('form');
  $divForm.appendChild($form);

  var $divForm1 = document.createElement('div');
  $divForm1.className = 'column-full';
  $form.appendChild($divForm1);

  var $textArea = document.createElement('textarea');
  $textArea.setAttribute('name', 'entry');
  $textArea.setAttribute('id', 'entry');
  $textArea.setAttribute('class', 'text-area');
  $textArea.setAttribute('placeholder', 'Notes..');
  $textArea.setAttribute('autocomplete', 'off');
  $textArea.value = data.editing.notes;
  $divForm1.appendChild($textArea);

  var $divForm2 = document.createElement('div');
  $divForm2.className = 'column-full rel';
  $form.appendChild($divForm2);

  var $input = document.createElement('input');
  $input.value = data.editing.imageUrl;
  $input.setAttribute('type', 'text');
  $input.setAttribute('class', 'photo-input');
  $input.setAttribute('name', 'photoURL');
  $input.setAttribute('placeholder', 'Upload Photo URL');
  $input.setAttribute('autocomplete', 'off');
  $divForm2.appendChild($input);

  var $delete = document.createElement('button');
  $delete.textContent = 'Delete';
  $delete.className = 'delete';
  $delete.setAttribute('type', 'button');
  $delete.setAttribute('id', 'deleteEntry');
  $delete.addEventListener('click', displayModal);
  $divForm2.appendChild($delete);

  var $button = document.createElement('button');
  $button.className = 'submit-button';
  $divForm2.appendChild($button);

  var $submit = document.createElement('img');
  $submit.className = 'submit-img';
  $submit.setAttribute('src', 'images/submit.png');
  $submit.setAttribute('type', 'image');
  $button.appendChild($submit);

  var $subtextDivRow = document.createElement('div');
  $subtextDivRow.className = 'row';
  $subtextDivRow.setAttribute('id', 'details');
  $divContainer.appendChild($subtextDivRow);

  var $subtextDiv = document.createElement('div');
  $subtextDiv.className = 'column-quarter subtext subtext-form';
  $subtextDiv.setAttribute('id', 'details');
  $subtextDivRow.appendChild($subtextDiv);

  var $year = document.createElement('p');
  $year.className = 'year';
  $year.textContent = 'Year: A';
  $subtextDiv.appendChild($year);

  var $lectionaryYear = document.createElement('p');
  $lectionaryYear.className = 'lectionary-year';
  $lectionaryYear.textContent = 'Weekdays: II';
  $subtextDiv.appendChild($lectionaryYear);

  color = xhrMonth.response[id].celebrations[0].colour;
  var colorCase = color.charAt(0).toUpperCase() + color.slice(1);

  var $color = document.createElement('p');
  $color.className = 'liturgical-color';
  $color.textContent = 'Color: ' + colorCase;
  $subtextDiv.appendChild($color);

  $journalPage.children[0].replaceWith($divContainer);
}

function createDomTree(obj) {
  var $divContainer = document.createElement('div');
  $divContainer.className = 'container background-color rel';

  var $divRow = document.createElement('div');
  $divRow.className = 'row center';
  $divContainer.appendChild($divRow);

  var $divCol = document.createElement('div');
  $divCol.className = 'column-full column-three-four center';
  $divRow.appendChild($divCol);

  var $p = document.createElement('p');
  $p.className = 'week';
  $p.textContent = obj.celebrations[0].title;
  $divCol.appendChild($p);

  var $img = document.createElement('img');
  $img.setAttribute('src', 'images/good-shepherd.jpg');
  $img.setAttribute('id', 'photo');
  $img.setAttribute('alt', 'Jesus The Good Shepherd');
  $img.setAttribute('onerror', "this.src = 'images/good-shepherd.jpg'");
  $divCol.appendChild($img);

  var $p1 = document.createElement('p');
  $p1.className = 'date';
  $p1.textContent = currentMonth + ' ' + obj.date[8] + obj.date[9] + ', 2022';
  $divCol.appendChild($p1);

  if (data.entries.length !== 0) {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === id) {
        var $divRow1 = document.createElement('div');
        $divRow1.className = 'row center';
        $divRow1.setAttribute('id', 'journal');
        $divContainer.appendChild($divRow1);

        var $divCol1 = document.createElement('div');
        $divCol1.className = 'column-full column-three-four center';
        $divRow1.appendChild($divCol1);

        var $p3 = document.createElement('p');
        $p3.textContent = data.entries[i].notes;
        $p3.className = 'notes';
        $divCol1.appendChild($p3);
        $img.setAttribute('src', data.entries[i].imageUrl);

        var $subtextDivRow = document.createElement('div');
        $subtextDivRow.className = 'row';
        $subtextDivRow.setAttribute('id', 'details');
        $divContainer.appendChild($subtextDivRow);

        var $subtextDiv = document.createElement('div');
        $subtextDiv.className = 'column-quarter subtext subtext-form';
        $subtextDiv.setAttribute('id', 'details');
        $subtextDivRow.appendChild($subtextDiv);

        var $edit = document.createElement('i');
        $edit.className = 'fas fa-pen-square';
        $edit.setAttribute('type', 'image');
        $edit.addEventListener('click', editEntry);
        $subtextDivRow.appendChild($edit);

        var $year = document.createElement('p');
        $year.className = 'year';
        $year.textContent = 'Year: A';
        $subtextDiv.appendChild($year);

        var $lectionaryYear = document.createElement('p');
        $lectionaryYear.className = 'lectionary-year';
        $lectionaryYear.textContent = 'Weekdays: II';
        $subtextDiv.appendChild($lectionaryYear);

        color = data.entries[i].color;
        var colorCase = color.charAt(0).toUpperCase() + color.slice(1);

        var $color = document.createElement('p');
        $color.className = 'liturgical-color';
        $color.textContent = 'Color: ' + colorCase;
        $subtextDiv.appendChild($color);

        return $divContainer;
      }
    }
  }
  var $divForm = document.createElement('div');
  $divForm.className = 'row center rel';
  $divContainer.appendChild($divForm);

  var $form = document.createElement('form');
  $divForm.appendChild($form);

  var $divForm1 = document.createElement('div');
  $divForm1.className = 'column-full';
  $form.appendChild($divForm1);

  var $textArea = document.createElement('textarea');
  $textArea.setAttribute('name', 'entry');
  $textArea.setAttribute('id', 'entry');
  $textArea.setAttribute('class', 'text-area');
  $textArea.setAttribute('placeholder', 'Notes..');
  $textArea.setAttribute('autocomplete', 'off');
  $divForm1.appendChild($textArea);

  var $divForm2 = document.createElement('div');
  $divForm2.className = 'column-full rel';
  $form.appendChild($divForm2);

  var $input = document.createElement('input');
  $input.setAttribute('type', 'text');
  $input.setAttribute('class', 'photo-input');
  $input.setAttribute('name', 'photoURL');
  $input.setAttribute('placeholder', 'Upload Photo URL');
  $input.setAttribute('autocomplete', 'off');
  $divForm2.appendChild($input);

  var $button = document.createElement('button');
  $button.className = 'submit-button';
  $divForm2.appendChild($button);

  var $submit = document.createElement('img');
  $submit.className = 'submit-img';
  $submit.setAttribute('src', 'images/submit.png');
  $submit.setAttribute('type', 'image');
  $button.appendChild($submit);

  $subtextDivRow = document.createElement('div');
  $subtextDivRow.className = 'row';
  $subtextDivRow.setAttribute('id', 'details');
  $divContainer.appendChild($subtextDivRow);

  $subtextDiv = document.createElement('div');
  $subtextDiv.className = 'column-quarter subtext subtext-form';
  $subtextDiv.setAttribute('id', 'details');
  $subtextDivRow.appendChild($subtextDiv);

  $year = document.createElement('p');
  $year.className = 'year';
  $year.textContent = 'Year: A';
  $subtextDiv.appendChild($year);
  $lectionaryYear = document.createElement('p');
  $lectionaryYear.className = 'lectionary-year';
  $lectionaryYear.textContent = 'Weekdays: II';
  $subtextDiv.appendChild($lectionaryYear);

  color = obj.celebrations[0].colour;
  colorCase = color.charAt(0).toUpperCase() + color.slice(1);

  $color = document.createElement('p');
  $color.className = 'liturgical-color';
  $color.textContent = 'Color: ' + colorCase;
  $subtextDiv.appendChild($color);

  return $divContainer;
}

function showDate(event) {
  id = event.target.closest('p').id;
  if (id === '') {
    return;
  }
  var obj = xhrMonth.response[id];
  var page = renderJournalPageDOM(obj);

  return page;
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

function removeItem(event) {
  if (event.target.id === 'cancel') {
    $modal.innerHTML = '';
    return;
  } if (event.target.id === 'delete') {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === id) {
        data.entries.splice(i, 1);
      }
      var $newPage = createDomTree(xhrMonth.response[id]);
      $journalPage.children[0].replaceWith($newPage);
      $modal.innerHTML = '';
      data.editing = null;
    }
  }
}

function displayModal(event) {
  $modal.className = '';
  var $div1 = document.createElement('div');
  $div1.className = 'background';
  $modal.appendChild($div1);

  var $div2 = document.createElement('div');
  $div2.className = 'modal-container center';
  $div1.appendChild($div2);

  var $div3 = document.createElement('div');
  $div3.className = 'row flex-wrap modal-width';
  $div2.appendChild($div3);

  var $div4 = document.createElement('div');
  $div4.className = 'column-full';
  $div3.appendChild($div4);

  var $heading = document.createElement('h5');
  $heading.textContent = 'Delete Entry?';
  $heading.className = 'modal-title';
  $div4.appendChild($heading);

  var $div5 = document.createElement('div');
  $div5.className = 'column-full buttons';
  $div3.appendChild($div5);

  var $cancelButton = document.createElement('button');
  $cancelButton.className = 'cancel-modal';
  $cancelButton.setAttribute('id', 'cancel');
  $cancelButton.textContent = 'Cancel';
  $div5.appendChild($cancelButton);
  var $deleteButton = document.createElement('button');
  $deleteButton.className = 'delete-modal';
  $deleteButton.setAttribute('id', 'delete');
  $deleteButton.textContent = 'Delete';
  $div5.appendChild($deleteButton);
}
