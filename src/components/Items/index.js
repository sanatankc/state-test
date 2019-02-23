import React from 'react'

const Items = props => {
  const onImage = id => e => {
    if (e.target.files[0]) {
      props.uploadThumbnail(id, e.target.files[0])
    }
  }
  return (
    <div>
      <button onClick={() => props.add()}>add</button>
      {props.items.map(item => (
        <div style={{ display: 'flex', margin: '10px' }}>
          <button style={{ marginRight: '10px' }} onClick={() => props.delete(item.id)}>delete</button>
          <button style={{ marginRight: '10px' }} onClick={() => props.update(item.id)}>update</button>
          <input
            type='file'
            onChange={onImage(item.id)}
            accept='image/png,image/jpeg,image/gif'
            style={{ marginRight: '10px' }}
          />
          <div>{item.thumbnail ? <a target='_blank' href={'https://s3.us-east-2.amazonaws.com/tekie-dev/' + item.thumbnail.uri}>image</a> : null} {item.order} --> {item.title}</div>
        </div>
      ))}
    </div>
  )
}

export default Items