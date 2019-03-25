import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import Nav from '../../components/Nav'
import fetchChapters from '../../actions/chapters/fetch'
import Items from '../../components/Items'
import deleteChapter from '../../actions/chapters/delete'
import addChapter from '../../actions/chapters/add'
import updateChapter from '../../actions/chapters/update'
import uploadFile from '../../actions/chapters/upload'

const Chapters = props => {
  const getJoke = async () => {
    const res = await fetch('http://api.icndb.com/jokes/random')
    const { value } = await res.json()
    return value.joke.substring(0, 118)
  }
  const updateChapterMock = async id => {
    updateChapter(id, {
      title: await getJoke()
    })
  }
  const tableLoading = () => {
    const isFetching = get(props.chapter, 'fetch.root.loading', true)
    if (isFetching) return 'fetching....'
    return null
  }
  const getLoadingTree = action => {
    const actionObject = get(props.chapter, action, {})
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
  const uploadThumbnail = (id, file) => {
    uploadFile(
      file, {
        fileBucket: 'python'
      }, {
        typeId: id,
        type: 'Chapter',
        typeField: 'thumbnail'
      }
    )
  }
  const addChapterMock = async () => {
    const { chapters } = props.chapter
    const order = chapters.length === 0
      ? 1
      : Math.max(...chapters.map(chapter => chapter.order)) + 1
    addChapter({
      order,
      title: await getJoke()
    })
  }
  useEffect(() => {
    if (!get(props.chapter, 'fetch.root.success', false)) {
      fetchChapters()
    }
  }, [])
  return (
    <div>
      <Nav />
      <Items
        items={props.chapter.get('chapters')}
        add={addChapterMock}
        update={updateChapterMock}
        uploadThumbnail={uploadThumbnail}
        delete={id => deleteChapter(id)}
        itemsLoading={itemsLoading()}
        tableLoading={tableLoading()}
      />
    </div>
  )
}

const mapStateToProps = state => {
  return {
  chapter: state.data.get('chapter')
}}
export default connect(mapStateToProps)(Chapters)
