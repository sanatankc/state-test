import styled from 'styled-components'

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 15px;
`
const Edit = styled.button.attrs({ shape: 'circle', icon: 'edit' })`
  margin-right: 10px;
`
const Delete = styled.button.attrs({ shape: 'circle', icon: 'delete' })``

const Label = styled.div`
  font-size: 14px;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  margin-left: 7px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? '0.5' : '1'};
  transition: 0.3s all ease-in-out;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`
const StyledInput = styled.input`
  margin-left: 10px;
  margin-right: 10px;
  width: auto;
  flex: 1;
  min-width: 20px;
`

Item.Edit = Edit
Item.Delete = Delete
Item.Label = Label
Item.Input = StyledInput

export default Item
