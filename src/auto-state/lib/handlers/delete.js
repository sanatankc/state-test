"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pluralize = require("pluralize");

var deleteHandler = function deleteHandler(schema) {
  return function (state, action) {
    var nextState = state;
    action.payload.getIn(['extractedData']).map(function (val, key) {
      if (schema.type === 'element') {
        nextState = null;
      } else if (schema.type === 'object') {
        nextState = {};
      } else {
        nextState = nextState.getIn([key, 'data']).filter(function (item) {
          return item.get('id') !== val.get('id');
        });
      }

      nextState = nextState.setIn([key, (0, _pluralize.plural)(key)], nextState);
    });
    return nextState;
  };
};

var _default = deleteHandler;
exports["default"] = _default;