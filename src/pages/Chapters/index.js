import React, { useEffect } from 'react'
import { connect } from 'react-redux'
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
    fetchChapters()
  }, [])
  return (
    <div>
      <Nav />
      <Items
        items={props.chapter.chapters}
        add={addChapterMock}
        update={updateChapterMock}
        uploadThumbnail={uploadThumbnail}
        delete={id => deleteChapter(id)}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  chapter: state.data.chapter
})
export default connect(mapStateToProps)(Chapters)
