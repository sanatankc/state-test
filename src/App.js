import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import duck from './duck'
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from './App.style'

const rootReducer = combineReducers({
  data: duck.reducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

duck.registerStore(store)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <AppContainer>
            <Routes />
          </AppContainer>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
