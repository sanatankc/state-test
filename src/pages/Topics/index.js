import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Nav from '../../components/Nav'
import fetchTopics from '../../actions/topics/fetch'
import Items from '../../components/Items'
import deleteTopic from '../../actions/topics/delete'
import addTopic from '../../actions/topics/add'
import updateTopic from '../../actions/topics/update'

const Topics = props => {
  const getJoke = async () => {
    const res = await fetch('http://api.icndb.com/jokes/random')
    const { value } = await res.json()
    return value.joke.substring(0, 118)
  }
  const updateTopicMock = async id => {
    updateTopic(id, {
      title: await getJoke()
    })
  }
  const addTopicMock = async () => {
    const { topics } = props.topic
    const order = topics.length === 0
      ? 1
      : Math.max(...topics.map(topic => topic.order)) + 1
    addTopic({
      order,
      title: await getJoke()
    })
  }
  useEffect(() => {
    fetchTopics()
  }, [])
  return (
    <div>
      <Nav />
      <Items
        items={props.topic.topics}
        add={addTopicMock}
        update={updateTopicMock}
        delete={id => deleteTopic(id)}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  topic: state.data.topic
})
export default connect(mapStateToProps)(Topics)
