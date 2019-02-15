import styled from 'styled-components'

const List = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`
const Wrapper = styled.div`
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  overflow: scroll;
`

List.Wrapper = Wrapper
export default List
