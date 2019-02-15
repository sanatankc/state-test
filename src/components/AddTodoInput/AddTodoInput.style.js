import styled from 'styled-components'

const Form = styled.form`
  display: flex;
`
const StyledInput = styled.input`
  border-radius: 4px 0px 0px 4px !important;
`
const StyledButton = styled.button`
  border-radius: 0px 4px 4px 0px !important;
`

Form.Input = StyledInput
Form.Button = StyledButton

export default Form
