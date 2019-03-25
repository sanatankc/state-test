import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Items = props => {
  const [parentId, setParentId] = useState()
  console.log(props)
  useEffect(() => {
    if (props.parentItems && props.parentItems.length > 0) {
      setParentId(props.parentItems[0].id)
    }
  }, [props.parentItems])

  const onImage = id => e => {
    if (e.target.files[0]) {
      props.uploadThumbnail(id, e.target.files[0])
    }
  }
  const renderItems = () => {
    const getLoadings = id => (props.itemsLoading || [])
      .map(itemLoading => itemLoading[id])
      .filter(itemLoading => itemLoading)

    return props.items.map(item => {
      const loadings = getLoadings(item.id)
      if (loadings.length) {
        return <div>{loadings[0]}</div>
      }
      return (
        <div style={{ display: 'flex', margin: '10px' }}>
          <button style={{ marginRight: '10px' }} onClick={() => props.delete(item.id)}>delete</button>
          <button style={{ marginRight: '10px' }} onClick={() => props.update(item.id)}>update</button>
          <input
            type='file'
            onChange={onImage(item.id)}
            accept='image/png,image/jpeg,image/gif'
            style={{ marginRight: '10px' }}
          />
          <div>{item.thumbnail ? <a target='_blank' href={'https://s3.us-east-2.amazonaws.com/tekie-dev/' + item.thumbnail.uri}>image</a> : null}
           <Link to={props.linkTo + '/' + item.id}>{item.order}</Link> --> {item.title}</div>
        </div>
      )
    })
  }

  const onChapterSelect = e => {
    setParentId(e.target.value)
  }

  if (props.tableLoading) return <div>{props.tableLoading}</div>
  return (
    <div>
      {
        props.parentItems &&
        <select onChange={onChapterSelect}>
          {props.parentItems.map(item => <option value={item.id}>{item.order}</option>)}
        </select>
      }
      <button onClick={() => props.add(parentId)}>add</button>
      {renderItems()}
    </div>
  )
}

export default Items