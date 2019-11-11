"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread8 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _pluralize = require("pluralize");

var _lodash = require("lodash");

var _immutable = require("immutable");

var _dataUtils = require("./data-utils");

var _handlers = _interopRequireDefault(require("./handlers"));

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
                if (Array.isArray(item[key])) {
                  mergedPayload[key] = [].concat((0, _toConsumableArray2["default"])(mergedPayload[key]), (0, _toConsumableArray2["default"])(item[key]));
                } else {
                  mergedPayload[key].push(item[key]);
                }
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

var mergeDuplicates = function mergeDuplicates(arr) {
  return arr.reduce(function (acc, current) {
    var x = acc.findIndex(function (item) {
      return item.id === current.id;
    });

    if (x === -1) {
      return acc.concat([current]);
    }

    acc[x] = (0, _objectSpread8["default"])({}, acc[x], current);
    return acc;
  }, []);
};

var State =
/*#__PURE__*/
function () {
  function State(config) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, State);
    (0, _defineProperty2["default"])(this, "addDataFieldToCustomInitialState", function (customInitialState) {
      var newCustomInitialState = {};

      for (var key in customInitialState) {
        newCustomInitialState[key] = customInitialState[key];

        if (!customInitialState[key].data) {
          newCustomInitialState[key].data = {};
        }
      }

      return newCustomInitialState;
    });
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

        return _handlers["default"][actionType[1]](_this.schema)(nextState, action);
      }

      return state;
    });
    (0, _defineProperty2["default"])(this, "query",
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var query, type, _ref$variables, variables, _ref$key, key, changeExtractedData, _ref$overrideAutoRedu, overrideAutoReducer, _ref$uniqId, uniqId, _ref3, data, extractedData, uniqueId;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = _ref.query, type = _ref.type, _ref$variables = _ref.variables, variables = _ref$variables === void 0 ? {} : _ref$variables, _ref$key = _ref.key, key = _ref$key === void 0 ? 'root' : _ref$key, changeExtractedData = _ref.changeExtractedData, _ref$overrideAutoRedu = _ref.overrideAutoReducer, overrideAutoReducer = _ref$overrideAutoRedu === void 0 ? null : _ref$overrideAutoRedu, _ref$uniqId = _ref.uniqId, uniqId = _ref$uniqId === void 0 ? null : _ref$uniqId;
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
                  extractedData = changeExtractedData(extractedData, data, _this.store.getState(), type.split('/')[0]);
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
                  overrideAutoReducer: !!overrideAutoReducer,
                  uniqueId: uniqueId
                });

                return _context.abrupt("return", data);

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](1);

                _this.store.dispatch({
                  type: "".concat(type, "/failure"),
                  error: _context.t0,
                  autoReducer: true,
                  key: key,
                  uniqId: uniqId
                });

              case 18:
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
      var actionTypes = Object.keys(_handlers["default"]);
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
      var actionTypes = Object.keys(_handlers["default"]);
      this.initialState = {};
      stateRoots.forEach(function (stateRoot) {
        _this4.initialState[stateRoot] = {};
        var rootType = _this4.schema[stateRoot].type;

        if (rootType === 'arrayOfObjects') {
          _this4.initialState[stateRoot].data = [];
        } else if (rootType === 'object') {
          _this4.initialState[stateRoot].data = {};
        } else {
          _this4.initialState[stateRoot].data = null;
        }

        actionTypes.forEach(function (actionType) {
          _this4.initialState[stateRoot]["".concat(actionType, "Status")] = {};
        });
      });
      this.initialState.errors = {};
      this.initialState = (0, _objectSpread8["default"])({}, this.initialState, this.addDataFieldToCustomInitialState(this.customInitialState));
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
      }); // merge all keys with same name and flat array of objects to object

      payload = flatAndMergePayload(payload); // mergeAllDuplicates with same ids

      payload = Object.keys(payload).reduce(function (acc, key) {
        if (_this5.schema[key.type] === 'arrayOfObjects' && (0, _lodash.isPlainObject)(payload[key])) {
          acc[key] = mergeDuplicates(payload[key]);
        } else {
          acc[key] = payload[key];
        }

        return acc;
      }, {}); // collapses children's data and apart from id as reference
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

      var updateParentReference = function updateParentReference(data, key, parentKey) {
        var parent = Array.isArray(data[parentKey]) ? data[parentKey] : [data[parentKey]];
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

          for (var _iterator5 = parent[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
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

      return collapseChildrenData;
    }
  }, {
    key: "merge",
    value: function merge(merger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!merger) return;
      var _options$type = options.type,
          type = _options$type === void 0 ? 'stateMerge' : _options$type,
          _options$key = options.key,
          key = _options$key === void 0 ? 'merge' : _options$key;
      var newState = merger(this.store.getState());

      if (newState) {
        this.store.dispatch({
          type: "".concat(type, "/merge/success"),
          autoReducer: true,
          payload: (0, _immutable.fromJS)({
            extractedData: newState
          }),
          key: key
        });
      }
    }
  }]);
  return State;
}();

var _default = State;
exports["default"] = _default;