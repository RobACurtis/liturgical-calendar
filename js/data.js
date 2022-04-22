/* exported data */
var data = {
  entries: [],
  editing: null
};

var previousEntriesJSON = localStorage.getItem('Input Form');
if (previousEntriesJSON !== null) {
  data = JSON.parse(previousEntriesJSON);
}

window.addEventListener('beforeunload', beforeUnload);
function beforeUnload(event) {
  var inputJSON = JSON.stringify(data);
  localStorage.setItem('Input Form', inputJSON);
}
