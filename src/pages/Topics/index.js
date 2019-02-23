import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Nav from '../../components/Nav'
import { get } from 'lodash'
import fetchTopics from '../../actions/topics/fetch'
import Items from '../../components/Items'
import deleteTopic from '../../actions/topics/delete'
import addTopic from '../../actions/topics/add'
import updateTopic from '../../actions/topics/update'
import fetchChapters from '../../actions/chapters/fetch'

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
  const addTopicMock = async chapterId => {
    const { topics } = props.topic
    const order = topics.length === 0
      ? 1
      : Math.max(...topics.map(topic => topic.order)) + 1
    addTopic({
      order,
      title: await getJoke(),
      chapterConnectId: chapterId
    })
  }

  const fetchData = async () => {
    await fetchChapters()
    await fetchTopics()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Nav />
      <Items
        items={props.topic.topics}
        parentItems={props.chapter.chapters}
        add={addTopicMock}
        update={updateTopicMock}
        delete={id => deleteTopic(id)}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  topic: state.data.topic,
  chapter: state.data.chapter
})
export default connect(mapStateToProps)(Topics)
