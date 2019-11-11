"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread8 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluralize = require("pluralize");

var _lodash = require("lodash");

var _immutable = require("immutable");

var _dataUtils = require("./src/data-utils");

var flatAndMergePayload = function flatAndMergePayload(payload) {
  var mergedPayload = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = payload[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var items = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          for (var _i = 0, _Object$keys = Object.keys(item); _i < _Object$keys.length; _i++) {
            var key = _Object$keys[_i];

            if (!Array.isArray(item[key]) || item[key].length) {
              if (mergedPayload[key]) {
                mergedPayload[key].push(item[key]);
              } else {
                mergedPayload[key] = item[key];
              }
            }
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

  return mergedPayload;
};

var State =
/*#__PURE__*/
function () {
  function State(config) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, State);
    (0, _defineProperty2["default"])(this, "reducer", function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.initialState;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      var actionType = action.type.split('/');
      var nextState = state;

      if (action.type && action.autoReducer) {
        nextState = nextState.setIn([actionType[0], "".concat(actionType[1], "Status"), action.key || 'root'], (0, _immutable.Map)({
          loading: actionType[2] === 'loading',
          failure: actionType[2] === 'failure',
          success: actionType[2] === 'success'
        }));

        if (actionType[2] === 'failure') {
          var errorKey = actionType.slice(0, -1).join('/');
          var errorKeyInErrors = nextState.getIn(['errors', errorKey]);
          var errorMap = (0, _immutable.Map)({
            error: action.error,
            uniqId: action.uniqId
          });
          var errorToPush = _immutable.List.isList(errorKeyInErrors) ? errorKeyInErrors.push(errorMap) : (0, _immutable.List)([errorMap]);
          nextState = nextState.setIn(['errors', errorKey], errorToPush);
        }

        if (action.overrideAutoReducer) {
          var overrideReducer = _this.overrideAutoReducers[action.uniqueId];
          return overrideReducer(nextState, action);
        }

        return _this.presets[actionType[1]](nextState, action);
      }

      return state;
    });
    (0, _defineProperty2["default"])(this, "query",
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var query, type, _ref$variables, variables, key, changeExtractedData, _ref$overrideAutoRedu, overrideAutoReducer, _ref$uniqId, uniqId, _ref3, data, extractedData, uniqueId;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = _ref.query, type = _ref.type, _ref$variables = _ref.variables, variables = _ref$variables === void 0 ? {} : _ref$variables, key = _ref.key, changeExtractedData = _ref.changeExtractedData, _ref$overrideAutoRedu = _ref.overrideAutoReducer, overrideAutoReducer = _ref$overrideAutoRedu === void 0 ? null : _ref$overrideAutoRedu, _ref$uniqId = _ref.uniqId, uniqId = _ref$uniqId === void 0 ? null : _ref$uniqId;
                _context.prev = 1;

                _this.store.dispatch({
                  type: "".concat(type, "/loading"),
                  key: key,
                  autoReducer: true
                });

                _context.next = 5;
                return _this.requestToGraphql(query, variables);

              case 5:
                _ref3 = _context.sent;
                data = _ref3.data;
                extractedData = _this.extractDataForDispatch(data);

                if (changeExtractedData) {
                  // changeExtractedData changes nested payload to
                  // flat with references
                  extractedData = changeExtractedData(extractedData, data, type.split('/')[0]);
                }
                /**
                 * Every action has a uniqueId attached to it.
                 * Because basically when we call duck.query we are calling
                 * an action and we can't send our overrideAutoReducer function
                 * because action should not have a function.
                 * So what we do instead is we assign our overrideAutoReducer
                 * in this.overrideAutoReducers, which is basically an object
                 * which contains overrideAutoReducer functions as a value to
                 * uniqueId key. And we also dispatch our unique id with action.
                 * That way reducer can lookup to this.overrideAutoReducers and check
                 * if there is a function for uniqueId dispatched with action. And if
                 * there is, it overrides the auto reducer.
                 */


                uniqueId = Math.random().toString(36).substr(2, 9);

                if (overrideAutoReducer) {
                  _this.overrideAutoReducers[uniqueId] = overrideAutoReducer;
                }

                _this.store.dispatch({
                  autoReducer: true,
                  type: "".concat(type, "/success"),
                  key: key,
                  payload: (0, _immutable.fromJS)({
                    originalData: data,
                    extractedData: extractedData
                  }),
                  overrideAutoReducer: overrideAutoReducer ? true : false,
                  uniqueId: uniqueId
                });

                return _context.abrupt("return", data);

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](1);
                console.error(_context.t0);

                _this.store.dispatch({
                  type: "".concat(type, "/failure"),
                  error: _context.t0,
                  autoReducer: true,
                  key: key,
                  uniqId: uniqId
                });

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 15]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    this.schema = config.schema;
    this.presets = config.presets;
    this.customInitialState = config.customInitialState;
    this.createInitialState();
    this.createChildrenSchema();
    this.createPossibleRootKeys();
    this.requestToGraphql = config.graphqlLib;
    this.overrideAutoReducers = {};
    this.action = this.createActions();
  }

  (0, _createClass2["default"])(State, [{
    key: "createPossibleRootKeys",
    value: function createPossibleRootKeys() {
      var _this2 = this;

      var rootKeys = Object.keys(this.schema);
      var aliases = Object.keys(this.schema).map(function (schemaKey) {
        return _this2.schema[schemaKey].alias ? _this2.schema[schemaKey].alias : [];
      }).reduce(function (prev, curr) {
        return [].concat((0, _toConsumableArray2["default"])(prev), (0, _toConsumableArray2["default"])(curr));
      }, []);
      this.possibleRootKeys = [].concat((0, _toConsumableArray2["default"])(rootKeys), (0, _toConsumableArray2["default"])(aliases));
    }
  }, {
    key: "parser",
    value: function parser(key) {
      for (var schemaKey in this.schema) {
        if (schemaKey === key) return schemaKey;

        if (this.schema[schemaKey].alias) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this.schema[schemaKey].alias[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var aliasKey = _step3.value;
              if (aliasKey === key) return schemaKey;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }

      return null;
    }
  }, {
    key: "createChildrenSchema",
    value: function createChildrenSchema() {
      var _this3 = this;

      this.childrenSchema = Object.keys(this.schema).reduce(function (prev, next) {
        var childSchema = prev;

        if (_this3.schema[next].children) {
          _this3.schema[next].children.forEach(function (child) {
            if (childSchema[child] && childSchema[child].parent) {
              childSchema[child].parent.push(next);
            } else {
              childSchema[child] = {
                parent: [next]
              };
            }
          });
        }

        return childSchema;
      }, {});
    }
  }, {
    key: "createActions",
    value: function createActions() {
      var stateRoots = Object.keys(this.schema);
      var actionTypes = Object.keys(this.presets);
      return stateRoots.map(function (stateRoot) {
        return actionTypes.map(function (actionType) {
          return "".concat(stateRoot, "/").concat(actionType);
        });
      }).reduce(function (prev, curr) {
        return prev.concat(curr);
      }).reduce(function (prev, curr) {
        var keyName = curr.split('/');
        keyName[1] = keyName[1].charAt(0).toUpperCase() + keyName[1].slice(1);
        return (0, _objectSpread8["default"])({}, prev, (0, _defineProperty2["default"])({}, keyName.join(''), curr));
      }, {});
    }
  }, {
    key: "registerStore",
    value: function registerStore(store) {
      this.store = store;
    }
  }, {
    key: "createInitialState",
    value: function createInitialState() {
      var _this4 = this;

      var stateRoots = Object.keys(this.schema);
      var actionTypes = Object.keys(this.presets);
      this.initialState = {};
      stateRoots.forEach(function (stateRoot) {
        _this4.initialState[stateRoot] = {};
        var rootType = _this4.schema[stateRoot].type;

        if (rootType === 'arrayOfObjects') {
          _this4.initialState[stateRoot]['data'] = [];
        } else if (rootType === 'object') {
          _this4.initialState[stateRoot]['data'] = {};
        } else {
          _this4.initialState[stateRoot]['data'] = null;
        }

        actionTypes.forEach(function (actionType) {
          _this4.initialState[stateRoot]["".concat(actionType, "Status")] = {};
        });
      });
      this.initialState['errors'] = {};
      this.initialState = (0, _objectSpread8["default"])({}, this.initialState, this.customInitialState);
      this.initialState = (0, _immutable.fromJS)(this.initialState);
    }
  }, {
    key: "extractDataForDispatch",
    value: function extractDataForDispatch(data) {
      var _this5 = this;

      // createLocalSchema identifies all top-level keys in nested tree
      // assigns it to localSchema
      var localSchema = {};

      var getPath = function getPath(path, key) {
        return path ? "".concat(path, ".").concat(key) : key;
      };

      var getKeywisePayload = function getKeywisePayload(data, keyPath, rootKey) {
        /**
         * Given path and data, it extracts keywise payload from server response.
         * Basically, what it does is traverse through the data to find all the
         * instances of given key, merge them together and returns a payload.
         */
        var paths = keyPath.split('.');
        var currentData = (0, _lodash.get)(data, paths[0]);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          var _loop = function _loop() {
            var path = _step4.value;
            currentData = Array.isArray(currentData) ? currentData : [currentData];
            var newCurrentData = currentData.map(function (data) {
              return data[path];
            }).filter(function (data) {
              return data;
            });

            if (Array.isArray(newCurrentData[0])) {
              newCurrentData = newCurrentData.reduce(function (acc, curr) {
                return [].concat((0, _toConsumableArray2["default"])(acc), (0, _toConsumableArray2["default"])(curr));
              }, []);
            }

            var rootKeyType = _this5.schema[rootKey].type;

            if (rootKeyType === 'element' || rootKeyType === 'object') {
              newCurrentData = newCurrentData[0];
            }

            currentData = newCurrentData;
          };

          for (var _iterator4 = paths.splice(1)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return currentData;
      };

      var createLocalSchema = function createLocalSchema(data) {
        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        /**
         * Recursively traverses through server payload to find all
         * root-level keys from schema and assigns them to localSchema
         */

        /**
         * if
         *   data = {
         *     chapters: {
         *       id: 0,
         *       title: 'A B C'
         *       topics: [
         *         {
         *           id: 0,
         *           title: 'B C D',
         *           learningObjective: {
         *             id: 3
         *           }
         *         },
         *         {
         *           id: 1,
         *           title: 'C C D'
         *         }
         *       ]
         *     }
         *   }
         *
         * then
         *   on createLocalSchema(data)
         *   localSchema becomes --> {
         *     chapters: {
         *       path: 'chapters',
         *       ...payload
         *     },
         *     topics: {
         *       path: 'chapters.topics'
         *       ...payload
         *     },
         *     learningObjective: {
         *       path: 'chapters.topics.learningObjective'
         *       ...payload
         *     }
         *   }
         *
         */
        // This👇 loops through all keys in top level root
        // (Because this is a recursive function
        // all keys on children will be top-level key on each
        // recursive operation)
        for (var _i2 = 0, _Object$keys2 = Object.keys(data); _i2 < _Object$keys2.length; _i2++) {
          var key = _Object$keys2[_i2];

          // Checks if the value is either object or array or
          // possibly could be one of the root keys or aliases
          if (Array.isArray(data[key]) || (0, _lodash.isPlainObject)(data[key]) || _this5.possibleRootKeys.includes(key)) {
            // parses root key to check whether it is present in schema
            var parsedKey = _this5.parser(key); // merges all arrays to combine all possible key props
            // (if the prop value is array of objects)


            var mergeAllArrays = Array.isArray(data[key]) ? data[key].reduce(function (acc, next) {
              return (0, _lodash.merge)(acc, next);
            }, {}) : data[key];

            if (parsedKey) {
              // sets in localSchema
              if (localSchema[parsedKey]) {
                localSchema[parsedKey].push({
                  path: getPath(path, key),
                  payload: mergeAllArrays
                });
              } else {
                localSchema[parsedKey] = [{
                  path: getPath(path, key),
                  payload: mergeAllArrays
                }];
              }
            } // calls function recursively


            if ((0, _lodash.isPlainObject)(mergeAllArrays)) {
              createLocalSchema(mergeAllArrays, "".concat(getPath(path, key)));
            }
          }
        }
      };

      createLocalSchema(data); // converts localSchema to separate payloads

      var payload = Object.keys(localSchema).map(function (rootKey) {
        return localSchema[rootKey].map(function (item) {
          return (0, _defineProperty2["default"])({}, rootKey, getKeywisePayload(data, item.path, rootKey));
        });
      });
      console.log('before flat and merge', payload); // merge all keys with same name and flat array of objects to object

      payload = flatAndMergePayload(payload);
      console.log('after flat and merge', payload); // collapses children's data and apart from id as reference
      // --> This could be merged with getKeywisePayload

      var collapseChildrenData = Object.keys(payload).reduce(function (acc, key) {
        var collapseItem = function collapseItem(item) {
          return Object.keys(item).reduce(function (prev, next) {
            if (item[next] && _this5.parser(next)) {
              return (0, _objectSpread8["default"])({}, prev, (0, _defineProperty2["default"])({}, next, Array.isArray(item[next]) ? item[next].map(function (childItem) {
                return {
                  id: childItem.id
                };
              }) : {
                id: item[next].id
              }));
            }

            return (0, _objectSpread8["default"])({}, prev, (0, _defineProperty2["default"])({}, next, item[next]));
          }, {});
        };

        return (0, _objectSpread8["default"])({}, acc, (0, _defineProperty2["default"])({}, key, Array.isArray(payload[key]) ? payload[key].map(function (item) {
          return collapseItem(item);
        }) : _this5.schema[key].type === 'element' ? payload[key] : collapseItem(payload[key])));
      }, {});
      console.log('collapsed children', payload);

      var updateParentReference = function updateParentReference(data, key, parentKey) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          var _loop2 = function _loop2() {
            var parentItem = _step5.value;
            var childReferenceInParentItem = parentItem[(0, _pluralize.plural)(key)] || parentItem[key];
            if (!childReferenceInParentItem) return {
              v: data
            };
            childReferenceInParentItem = Array.isArray(childReferenceInParentItem) ? childReferenceInParentItem : [childReferenceInParentItem];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              var _loop3 = function _loop3() {
                var item = _step6.value;
                var childItem = (0, _dataUtils.getDataById)(data[key], item.id);

                if (childItem) {
                  data[key] = data[key].map(function (item) {
                    if (item.id === childItem.id) {
                      if (item[(0, _pluralize.plural)(parentKey)]) {
                        return (0, _objectSpread8["default"])({}, item, (0, _defineProperty2["default"])({}, (0, _pluralize.plural)(parentKey), [].concat((0, _toConsumableArray2["default"])(parentKey), [{
                          id: parentItem.id
                        }])));
                      }

                      return (0, _objectSpread8["default"])({}, item, (0, _defineProperty2["default"])({}, (0, _pluralize.plural)(parentKey), [{
                        id: parentItem.id
                      }]));
                    }

                    return item;
                  });
                }
              };

              for (var _iterator6 = childReferenceInParentItem[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                _loop3();
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                  _iterator6["return"]();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }
          };

          for (var _iterator5 = data[parentKey][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _ret = _loop2();

            if ((0, _typeof2["default"])(_ret) === "object") return _ret.v;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return data;
      };

      for (var key in collapseChildrenData) {
        if (Object.keys(this.childrenSchema).includes(key)) {
          var parentKeys = this.childrenSchema[key].parent;
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = parentKeys[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var parentKey = _step7.value;

              if (Object.keys(collapseChildrenData).includes(parentKey)) {
                collapseChildrenData = updateParentReference(collapseChildrenData, key, parentKey);
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                _iterator7["return"]();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      }

      console.log('parent Refrence updated', payload);
      return collapseChildrenData;
    }
  }]);
  return State;
}();

var _default = State;
exports["default"] = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nestTopicsInChapter = exports.nestChildrenIntoParent = exports.filterItems = exports.getDataById = exports.getDataByProp = exports.getItemByProp = exports.getOrderAutoComplete = exports.getOrdersInUse = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread4 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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
};

exports.nestTopicsInChapter = nestTopicsInChapter;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _State = _interopRequireDefault(require("./State"));

var _default = _State["default"];
exports["default"] = _default;
