import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import AddTodoInput from './components/AddTodoInput'
import Footer from './components/Footer'
import rootReducer from './reducers'
import Routes from './routes'
import { AppContainer, Card, FlexColumn } from './App.style'

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
            <Card>
              <FlexColumn>
                <AddTodoInput />
                <Routes />
                <Footer />
              </FlexColumn>
            </Card>
          </AppContainer>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
