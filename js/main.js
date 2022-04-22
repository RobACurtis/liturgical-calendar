var $monthTitle = document.querySelector('.month-title');
var $journalPage = document.querySelector('#journalPage');
var $calendarPage = document.querySelector('#calendar-page');
var $modal = document.querySelector('#modal');
$modal.addEventListener('click', removeItem);
var $calendar = document.querySelector('#calendar');
var $feastDayList = document.querySelector('ul.feast-days');
var $calDate = document.querySelector('.calendar-date');
var $leftArrow = document.querySelector('.fa-arrow-left');

$leftArrow.addEventListener('click', viewSwap);

$journalPage.addEventListener('input', addPhoto);
$journalPage.addEventListener('submit', addEntry);

$calendar.addEventListener('click', showDate);

var id = '';
var date = '';
var currentMonth = '';
var color = '';

var xhrMonth = new XMLHttpRequest();
xhrMonth.open('GET', 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default/2022/4');
xhrMonth.responseType = 'json';
xhrMonth.addEventListener('load', renderMonth);
xhrMonth.send();

function viewSwap(event) {
  if (event.target.id === 'deleteEntry') {
    $modal.className = '';
    return;
  }
  $journalPage.className = 'hidden';
  $calendarPage.className = 'container background-color rel margin-top padding-bottom';
  $leftArrow.className = 'hidden';
}

function addPhoto(event) {
  if (event.target.name !== 'photoURL') {
    return;
  }
  var $photo = $journalPage.children[0].children[0].children[0].children[1];
  var src = event.target.value;
  $photo.setAttribute('src', src);
}

function renderDate(obj) {
  if ($journalPage.children.length > 0) {
    for (var i = 0; i < $journalPage.children.length; i++) {
      $journalPage.removeChild($journalPage.children[i]);
    }
  }
  var journalPage = createDomTree(obj);
  $journalPage.appendChild(journalPage);
  $journalPage.className = 'container background-color rel';
  $calendarPage.className = 'hidden';
  $leftArrow.className = 'fas fa-arrow-left';
  return journalPage;
}

function renderMonth() {
  var month = xhrMonth.response;
  var emptyDays = 0;
  date = xhrMonth.response[0].date;
  currentMonth = getMonth(date);

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
  $monthTitle.textContent = currentMonth;
  for (i = 0; i < month.length; i++) {
    $p = document.createElement('p');
    $p.setAttribute('id', i);
    $p.className = 'cal rel';
    $p.textContent = i + 1;
    $calendar.appendChild($p);
    if (month[i].celebrations[0].rank_num <= 2.8) {
      var weekday = month[i].weekday;
      var day = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      var $span = document.createElement('span');
      $span.textContent = month[i].celebrations[0].title;
      $p.appendChild($span);
      var $li = document.createElement('li');
      $li.textContent = day + ' ' + currentMonth + ' ' + (i + 1) + ', ' + month[i].celebrations[0].title;
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
  $img.setAttribute('onerror', "this.src = 'images/GoodShepherd.jpg'");
  $divCol.appendChild($img);

  var $p1 = document.createElement('p');
  $p1.className = 'date';
  $p1.textContent = currentMonth + ' ' + xhrMonth.response[id].date[8] + xhrMonth.response[id].date[9] + ', 2022';
  $divCol.appendChild($p1);

  var $divForm = document.createElement('div');
  $divForm.className = 'row center rel';
  $divForm.setAttribute('data-view', 'entry-form');
  $divContainer.appendChild($divForm);

  var $form = document.createElement('form');
  $form.setAttribute('action', '');
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
  $delete.addEventListener('click', viewSwap);
  $divForm2.appendChild($delete);

  var $submit = document.createElement('input');
  $submit.className = 'submit';
  $submit.setAttribute('src', 'images/Submit.png');
  $submit.setAttribute('type', 'image');
  $divForm2.appendChild($submit);

  var $subtextDiv = document.createElement('div');
  $subtextDiv.className = 'column-quarter subtext subtext-form';
  $subtextDiv.setAttribute('id', 'details');
  $divContainer.appendChild($subtextDiv);

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
  $img.setAttribute('src', 'images/GoodShepherd.jpg');
  $img.setAttribute('id', 'photo');
  $img.setAttribute('alt', 'Jesus The Good Shepherd');
  $img.setAttribute('onerror', "this.src = 'images/GoodShepherd.jpg'");
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

        var $edit = document.createElement('i');
        $edit.className = 'fas fa-pen-square';
        $edit.setAttribute('src', 'images/Submit.png');
        $edit.setAttribute('type', 'image');
        $edit.addEventListener('click', editEntry);
        $divRow1.appendChild($edit);

        var $subtextDiv = document.createElement('div');
        $subtextDiv.className = 'column-quarter subtext subtext-entry';
        $subtextDiv.setAttribute('id', 'details');
        $divContainer.appendChild($subtextDiv);

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
  $divForm.setAttribute('data-view', 'entry-form');
  $divContainer.appendChild($divForm);

  var $form = document.createElement('form');
  $form.setAttribute('action', '');
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

  var $submit = document.createElement('input');
  $submit.className = 'submit';
  $submit.setAttribute('src', 'images/Submit.png');
  $submit.setAttribute('type', 'image');
  $divForm2.appendChild($submit);

  $subtextDiv = document.createElement('div');
  $subtextDiv.className = 'column-quarter subtext subtext-form';
  $subtextDiv.setAttribute('id', 'details');
  $divContainer.appendChild($subtextDiv);

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
  var page = renderDate(obj);
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
    $modal.className = 'hidden';
    return;
  }
  for (var i = 0; i < data.entries.length; i++) {
    if (data.entries[i].id === id) {
      data.entries.splice(i, 1);
    }
    var $newPage = createDomTree(xhrMonth.response[id]);
    $journalPage.children[0].replaceWith($newPage);
    $modal.className = 'hidden';
    data.editing = null;
  }
}
