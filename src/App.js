import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { singular } from 'pluralize'
import { createStore, combineReducers } from 'redux'
import gql from 'graphql-tag'
import { BrowserRouter } from 'react-router-dom'
import State from './utils/State'
import { AppContainer } from './App.style'

const parser = (schema, field) => {
  const root = key => {
    return field === key
  }
  const plural = key => {
    return singular(field) === key
  }
  const parsers = [root, plural]
  for (const key of Object.keys(schema)) {
    for (const parser of parsers) {
      if (parser(key)) {
        return key
      }
    }
  }
  return false
}

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
  parser,
  presets: {
    fetch: () => {

    },
    add: () => ''
  },
})



const rootReducer = combineReducers({
  data: duck.reducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

duck.addStoreRefrence(store)

const fetchChapters = () => duck.query({
  query: gql`{
    chapters {
      id
      title
      topics {
        id
        title
      }
    }
  }`,
  type: duck.action.chapterFetch,
})
fetchChapters()

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
