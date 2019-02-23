import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Root from './pages/Root'
import Chapters from './pages/Chapters'
import Topics from './pages/Topics'
import TopicVideo from './pages/TopicVideo'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Root} />
    <Route exact path='/chapters' component={Chapters} />
    <Route exact path='/topics' component={Topics} />
    <Route exact path='/video/:id' component={TopicVideo} />
    <Route path='/' render={() => 'Not Found'} />
  </Switch>
)

export default Routes
