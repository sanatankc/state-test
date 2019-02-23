import React, { useEffect } from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import uploadFile from '../../actions/chapters/upload'
import fetchVideo from '../../actions/topics/fetchVideo'
import { getDataById } from '../../utils/data-utils'

const TopicVideo = props => {
  useEffect(() => {
    fetchVideo(props.match.params.id)
  }, [])

  const uploadVideo = e => {
    if (e.target.files[0]) {
      uploadFile(
        e.target.files[0], {
          fileBucket: 'python'
        }, {
          typeId: props.match.params.id,
          type: 'Topic',
          typeField: 'video'
        }
      )
    }
  }
  const topicItem = getDataById(props.topic.topics, props.match.params.id)
  if ()
  return (
    <div>
      <input
        type='file'
        onChange={uploadVideo}
        accept='video/*'
        style={{ marginRight: '10px' }}
      />
      <div>
        <a href={'https://s3.us-east-2.amazonaws.com/tekie-dev/' + get(topicItem, 'video.uri')}>{get(topicItem, 'video.name')}</a>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  topic: state.data.topic
})
export default connect(mapStateToProps)(withRouter(TopicVideo))
