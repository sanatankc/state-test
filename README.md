# Use antd in create-react-app

## Step by Step Documentation

- English: https://ant.design/docs/react/use-with-create-react-app
- 中文：https://ant.design/docs/react/use-with-create-react-app-cn

## Preview

```bash
$ npm install
$ npm start
```

or:

```bash
$ yarn
$ yarn start
```

## Folder Structure

This boilerplate includes an example todo app with a defined folder structure.
Although completely customisable, it provides an overview to maintain a folder
strucutre for long term scalable apps.

    ├── public
    ├── src
    │   ├── components
    │   │   ├── TodoList
    │   │   │   ├── index.js
    │   │   │   ├── TodoList.js
    │   │   │   ├── TodoList.spec.js
    │   │   │   └── TodoList.style.js
    │   │   ├── TodoItem
    │   │   │   └── ...
    │   │   └── ...
    │   ├── pages
    │   │   ├── active
    │   │   │   ├── components
    │   │   │   │   └── ...
    │   │   │   ├── active.style.js
    │   │   │   └── index.js
    │   │   └── ...
    │   ├── reducers
    │   │   ├── filter
    │   │   │   ├── index.js
    │   │   │   └── filter.spec.js
    │   │   ├── ...
    │   │   ├── ...
    │   │   └── index.js
    │   ├── actions
    │   │   ├── actionTypes.js
    │   │   ├── addTodo.js
    │   │   ├── deleteTodo.js
    │   │   ├── ...
    │   │   ├── ...
    │   │   └── index.js
    │   ├── App.js
    │   ├── App.style.js
    │   ├── index.css
    │   ├── index.js
    │   ├── registerServiceWorker.js
    │   ├── routes.js
    │   └── setupTests.js
    │
    ├── config-overrides.js
    ├── package.json
    ├── package.lock.json
    └── .gitignore

 - **src/**: root directorry of the app
 - **src/actions/**: contain redux actions
 - **src/actions/actionTypes.js**: contain action constants
 - **src/actions/actionCreator.js**: contains an action creator
 - **src/actions/index.js**: exports all action creators
 - **src/reducers/**: contain reducers
 - **src/reducers/reducerName**: contains a single reducer
 - **src/reducers/reducerName/index.js**: file for a single reducer
 - **src/reducers/reducerName/reducerName.spec.js**: tests a single reducer
 - **src/reducers/index.js**: combines all reducers and exports it
 - **src/components**: contain global components
 - **src/components/ComponentName**: contains a global component
 - **src/components/ComponentName/ComponentName.js**: main file for the component
 - **src/components/ComponentName/ComponentName.style.js**: contain styles for component
 - **src/components/ComponentName/ComponentName.spec.js**: contain tests for component
 - **src/components/ComponentName/index**: connects components to redux or attaches other higher order component
 - **src/pages/**: contain components for the routes or pages
 - **src/pages/ComponentName**: contains component for the routes or pages
 - **src/pages/ComponentName/index.js**: connects components to redux or attaches other higher order component
 - **src/pages/ComponentName/ComponentName.js**: main file for the component
 - **src/pages/ComponentName/ComponentName.style.js**: contain styles for component
 - **src/pages/ComponentName/components**: contain local components for page
 - **src/routes.js**: contains all the routes for the App
 - **src/App.js**: exports whole app
 - **src/App.style.js**: contains styles for App
 - **src/index.js**: root javascript file (renders App component to the dom)
 - **src/index.css**: global css file for the App
 - **src/registerServiceWorker.js**: registers Server Worker
 - **src/setupTests.js**: setups tests and variables for the tests
 - **config-overrides.js**: override webpack configs

## Debugging
**React**: to debug react components, install the [chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) or the [firefox addon](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Redux**: to debug redux store, install the [chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) or the [firefox addon](https://addons.mozilla.org/en-US/firefox/addon/remotedev/)

**Styled Components**: Just open your developer tools, your component name will be show up as class-name.

## What more

- [antd](http://github.com/ant-design/ant-design/)
- [babel-plugin-import](http://github.com/ant-design/babel-plugin-import/)
- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [react-app-rewired](https://github.com/timarney/react-app-rewired)
- [less-loader](https://github.com/webpack/less-loader)
