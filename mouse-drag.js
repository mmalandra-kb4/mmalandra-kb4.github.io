// Originally from https://ghostinspector.com/blog/simulate-drag-and-drop-javascript-casperjs/
// trimmed down and modified by @kemokid (Martin Baker) to work with Sortable.js
///
// Probably not going to work with dragging from one list to another

// This has been made more general, to work with other drag-and-drop elements besides a
// Sortable list, but is not as complete as the Casper example above.

// Call with DOM selectors, eg `triggerDragAndDrop('#drag', '#drop');`

// Returns false if unable to start.
// callback, if present, will be called with true if able to finish, false if not.
// If you receive "false" on the callback, the list is likely not in the beginning state.
var triggerDragAndDrop = function (elemDrag, elemDrop, callback) {
  var DELAY_INTERVAL_MS = 100;
  var MAX_TRIES = 10;
  var dragStartEvent;

  if (!elemDrag || !elemDrop) {
    console.log("can't get elements");
    return false;
  }

  // function for triggering mouse events
  function fireMouseEvent(type, elem, dataTransfer) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(type, true, true, window, 1, 1, 1, 0, 0, false, false, false, false, 0, elem);
    if (/^dr/i.test(type)) {
      evt.dataTransfer = dataTransfer || createNewDataTransfer();
    }

    elem.dispatchEvent(evt);
    return evt;
  };

  function createNewDataTransfer() {
    var data = {};
    return {
      clearData: function(key) {
        if (key === undefined) {
          data = {};
        } else {
          delete data[key];
        }
      },
      getData: function(key) {
        return data[key];
      },
      setData: function(key, value) {
        data[key] = value;
      },
      setDragImage: function() {},
      dropEffect: 'none',
      files: [],
      items: [],
      types: [],
      // also effectAllowed      
    }
  };

  // trigger dragging process on top of drop target
  // We sometimes need to do this multiple times due to the vagaries of
  // how Sortable manages the list re-arrangement
  function dragOver() {
    console.log('DRAGOVER');
    fireMouseEvent('dragover', elemDrop, dragStartEvent.dataTransfer);
  }

  function drop() {
    console.log('DROP');
    // release dragged element on top of drop target
    fireMouseEvent('drop', elemDrop, dragStartEvent.dataTransfer);
    fireMouseEvent('pointerup', elemDrop);    // not strictly necessary but I like the symmetry
    if (callback) callback(true);
  }
  
  function dragStart() {
    console.log('DRAGSTART');
    dragStartEvent = fireMouseEvent('dragstart', elemDrag);
  }

  // start dragging process
  console.log('STARTING DRAG');
  fireMouseEvent('pointerdown', elemDrag);
  setTimeout(dragStart, 1000);
  setTimeout(dragOver, DELAY_INTERVAL_MS);
  setTimeout(drop, DELAY_INTERVAL_MS * 2);
  return true;
};
