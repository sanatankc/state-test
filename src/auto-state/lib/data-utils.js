"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeListsOfMapsById = exports.nestTopicsInChapter = exports.nestChildrenIntoParent = exports.filterItems = exports.getDataById = exports.getDataByProp = exports.getItemByProp = exports.getOrderAutoComplete = exports.getOrdersInUse = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread4 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _lodash = require("lodash");

var getOrdersInUse = function getOrdersInUse(data) {
  return data.map(function (item) {
    return item.order;
  });
};

exports.getOrdersInUse = getOrdersInUse;

var getOrderAutoComplete = function getOrderAutoComplete(orders) {
  var defaultOrder = Math.max.apply(Math, (0, _toConsumableArray2["default"])(orders)) + 1;
  return Number.isFinite(defaultOrder) ? defaultOrder : 1;
};

exports.getOrderAutoComplete = getOrderAutoComplete;

var getItemByProp = function getItemByProp(data, prop, value) {
  var foundData = data.find(function (item) {
    return (0, _lodash.get)(item, prop) === value;
  }) || {};
  return foundData;
};

exports.getItemByProp = getItemByProp;

var getDataByProp = function getDataByProp(data, prop, value) {
  if (!data) return [];
  var foundData = data.filter(function (item) {
    return (0, _lodash.get)(item, prop) === value;
  }) || [];
  return foundData;
};

exports.getDataByProp = getDataByProp;

var getDataById = function getDataById(data, id) {
  return getItemByProp(data, 'id', id);
};

exports.getDataById = getDataById;

var filterItems = function filterItems(arr, itemsToRemove) {
  return arr.filter(function (item) {
    return !itemsToRemove.includes(item);
  });
};
/**
 * takes a children property and makes it parent
 * @example
 * ```js
 * const a = [
 *  { id: 0, parent: {id: 0} },
 *  { id: 1, parent: {id: 0} }
 *  { id: 2, parent: {id: 1} },
 *  { id: 3, parent: { id: 1 }}
 * ]
 * nestChildrenIntoParent(a, 'child', 'parent')
 * result -> [
 * { id: 0, child: [{ id: 0 }, {id: 1}] }
 * { id: 1, child: [{ id: 2 }, {id: 3}] }
 * ]
 * ```
 */


exports.filterItems = filterItems;

var nestChildrenIntoParent = function nestChildrenIntoParent(children, childrenName, parentName, propertyToExtract) {
  var data = [];
  children.forEach(function (child) {
    var parent = (0, _lodash.pick)(child, [parentName])[parentName];
    var rest = (0, _lodash.omit)(child, [parentName, propertyToExtract]);
    if (!parent || (0, _lodash.isEmpty)(parent)) return;
    var item = getDataById(data, parent.id);

    if ((0, _lodash.isEmpty)(item)) {
      var _objectSpread2;

      var dataToPush = propertyToExtract !== undefined ? (0, _objectSpread4["default"])({}, parent, (_objectSpread2 = {}, (0, _defineProperty2["default"])(_objectSpread2, propertyToExtract, child[propertyToExtract]), (0, _defineProperty2["default"])(_objectSpread2, childrenName, [rest]), _objectSpread2)) : (0, _objectSpread4["default"])({}, parent, (0, _defineProperty2["default"])({}, childrenName, [rest]));
      data.push(dataToPush);
    } else {
      var parentIndex = data.map(function (x) {
        return x.id;
      }).indexOf(parent.id);
      data[parentIndex][childrenName].push(rest);
    }
  });
  return data;
};

exports.nestChildrenIntoParent = nestChildrenIntoParent;

var nestTopicsInChapter = function nestTopicsInChapter(topics) {
  return nestChildrenIntoParent(topics, 'topics', 'chapter');
}; // ---- Immutable.js - part ---- //

/**
 * collectionA: List([ Map({ id:  0,  propA: 'a'})  ])
 * collectionB: List([ Map({ id: 0, propB: 'b'}), Map({ id: 1, propA: 'a' }) ])
 *
 * mergedList -->
 *  List([ Map({ id: 0, propA: 'a', propB: 'b' }), Map({ id: 1, propA: 'a' }) ])
 */


exports.nestTopicsInChapter = nestTopicsInChapter;

var mergeListsOfMapsById = function mergeListsOfMapsById(collectionA, collectionB) {
  var mergedList = collectionA; // collectionB could be either List of Maps or Map
  // if Map --> convert into List of Map

  if (!_immutable.List.isList(collectionB)) {
    collectionB = (0, _immutable.List)([collectionB]);
  }

  collectionB.forEach(function (itemB) {
    var indexOfItemBInCollectionA = collectionA.findIndex(function (itemA) {
      return itemA.get('id') === itemB.get('id');
    });

    if (indexOfItemBInCollectionA > -1) {
      mergedList = mergedList.update(indexOfItemBInCollectionA, function (item) {
        return item.merge(itemB);
      });
    } else {
      mergedList = mergedList.push(itemB);
    }
  });
  return mergedList;
};

exports.mergeListsOfMapsById = mergeListsOfMapsById;