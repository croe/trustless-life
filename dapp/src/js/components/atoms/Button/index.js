import styled from 'styled-components'

const Button = styled.button`
  width: ${props => props.width};
  height: ${props => props.height};
  ${props => getButtonShape(props)}
  display: flex;
  justify-contents: flex-start;
  align-items:
`;

const getButtonShape = props => {
  if (props.rounded) {
    return `border-radius: ${props.height};`
  } else {
    return `border-radius: 10px;`
  }
}

export default Button;