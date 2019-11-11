"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _immutable = require("immutable");

var mergeAndRemoveListOfMaps = function mergeAndRemoveListOfMaps(state, stateToBeMerged, key) {
  var mergedListOfMaps = (0, _immutable.List)([]);
  var stateRelatedToKey = state.filter(function (item) {
    return item.get("__keys").includes(key);
  });
  var stateNotRelatedToKey = state.filter(function (item) {
    return !item.get("__keys").includes(key);
  });

  var pushInMergedListOfMaps = function pushInMergedListOfMaps(item, itemInMergedList) {
    if (itemInMergedList !== -1) {
      mergedListOfMaps = mergedListOfMaps.set(itemInMergedList, mergedListOfMaps.get(itemInMergedList).merge(item));
    } else {
      mergedListOfMaps = mergedListOfMaps.push(item);
    }
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var item = _step.value;
      var prevStateAtItemId = state.find(function (stateItem) {
        return stateItem.get("id") === item.get("id");
      });
      var itemInMergedList = mergedListOfMaps.findIndex(function (stateItem) {
        return stateItem.get("id") === item.get("id");
      });

      if (prevStateAtItemId) {
        if (!prevStateAtItemId.get("__keys").includes(key)) {
          prevStateAtItemId = prevStateAtItemId.set("__keys", prevStateAtItemId.get("__keys").push(key));
        }

        pushInMergedListOfMaps(prevStateAtItemId.merge(item), itemInMergedList);
        stateRelatedToKey = stateRelatedToKey.filter(function (stateItem) {
          return stateItem.get("id") !== item.get("id");
        });
        stateNotRelatedToKey = stateNotRelatedToKey.filter(function (stateItem) {
          return stateItem.get("id") !== item.get("id");
        });
      } else {
        pushInMergedListOfMaps(item.set("__keys", (0, _immutable.List)([key])), itemInMergedList);
      }
    };

    for (var _iterator = stateToBeMerged[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  mergedListOfMaps = mergedListOfMaps.merge(stateNotRelatedToKey);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = stateRelatedToKey[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var item = _step2.value;

      if (item.get("__keys").size > 1) {
        var keys = item.get("__keys");
        mergedListOfMaps = mergedListOfMaps.push(item.set("__keys", keys["delete"](keys.findIndex(function (x) {
          return x === key;
        }))));
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return mergedListOfMaps;
};

var fetchAddUpdate = function fetchAddUpdate(schema) {
  return function (state, action) {
    var nextState = state;
    action.payload.getIn(["extractedData"]).map(function (val, key) {
      var prevStateAtKey = nextState.getIn([key, "data"]);
      var nextStateAtKey;
      var keyType = schema[key].type;

      if (keyType === "arrayOfObjects") {
        val = _immutable.List.isList(val) ? val : (0, _immutable.List)([val]);
        nextStateAtKey = mergeAndRemoveListOfMaps(prevStateAtKey, val, action.key);
      } else if (keyType === "object") {
        nextStateAtKey = prevStateAtKey.merge(val);
      } else {
        nextStateAtKey = val;
      }

      nextState = nextState.setIn([key, "data"], nextStateAtKey);
    });
    return nextState;
  };
};

var _default = fetchAddUpdate;
exports["default"] = _default;