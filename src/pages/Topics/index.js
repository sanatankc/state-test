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
    if (!get(props.chapter, 'fetch.root.success', false)) {
      await fetchChapters()
    }
    if (!get(props.topic, 'fetch.root.success', false)) {
      await fetchTopics()
    }
  }

  const tableLoading = () => {
    const isFetchingChapter = get(props.chapter, 'fetch.root.loading', true)
    const isFetchingTopic = get(props.topic, 'fetch.root.loading', true)

    if (isFetchingChapter || isFetchingTopic) return 'fetching....'
    return null
  }

  const getLoadingTree = action => {
    const actionObject = get(props.topic, action, {})
    return Object.keys(actionObject).reduce((acc, key) => {
      const keys = key.split('/')
      if (keys.length === 2 && keys[0] === 'root') {
        return {
          ...acc,
          [keys[1]]: actionObject[key].loading ? `${action}...` : false
        }
      }
    }, {})
  }

  const itemsLoading = () => {
    const actions = ['update', 'delete']
    return actions.map(action => getLoadingTree(action))
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
        itemsLoading={itemsLoading()}
        tableLoading={tableLoading()}
        linkTo='/video'
      />
    </div>
  )
}

const mapStateToProps = state => ({
  topic: state.data.topic,
  chapter: state.data.chapter
})
export default connect(mapStateToProps)(Topics)
