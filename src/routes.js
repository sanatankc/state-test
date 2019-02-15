import React from 'react'
import { Route, Switch } from 'react-router-dom'
import RootPage from './pages/root'
import ActivePage from './pages/active'
import CompletedPage from './pages/completed'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={RootPage} />
    <Route exact path='/active' component={ActivePage} />
    <Route exact path='/completed' component={CompletedPage} />
    <Route path='/' render={() => 'Not Found'} />
  </Switch>
)

export default Routes
