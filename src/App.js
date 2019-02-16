import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import gql from 'graphql-tag'
import { BrowserRouter } from 'react-router-dom'
import State from './utils/State'
import { AppContainer } from './App.style'

const duck = new State({
  schema: {
    chapter: {
      children: ['topic'],
    },
    topic: {
      children: ['learningObjective']
    },
    learningObjective: {}
  },
  presets: {
    fetch: () => '',
    add: () => ''
  },
  parsers: [],
})

const fetchChapters = () => duck.query({
  query: gql`{
    chapters {
      id
      title
    }
  }`,
  type: duck.action.chapterFetch,
})
fetchChapters()

const rootReducer = combineReducers({
  data: duck.reducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <AppContainer>
            <div>fdjgk</div>
          </AppContainer>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
