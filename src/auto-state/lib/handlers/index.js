"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fetchAddUpdate = _interopRequireDefault(require("./fetchAddUpdate"));

var _delete = _interopRequireDefault(require("./delete"));

var onSuccessTypeAction = function onSuccessTypeAction(handler) {
  return function (schema) {
    return function (state, action) {
      // Checks if action is successful.
      var nextState = state;

      if (action.type.split('/')[2] === 'success') {
        nextState = handler(schema)(state, action);
      }

      return nextState;
    };
  };
};

var _default = {
  fetch: onSuccessTypeAction(_fetchAddUpdate["default"]),
  merge: onSuccessTypeAction(_fetchAddUpdate["default"]),
  add: onSuccessTypeAction(_fetchAddUpdate["default"]),
  update: onSuccessTypeAction(_fetchAddUpdate["default"]),
  "delete": onSuccessTypeAction(_delete["default"])
};
exports["default"] = _default;