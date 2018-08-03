import styled from 'styled-components'
import Const from '../../../const'

import CameraIcon from './camera.png'

const CameraButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(19deg,${Const.Color.DISTRICT.aB} 0%,${Const.Color.DISTRICT.B} 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${Const.Color.DEFAULT};
  &:after {
    content: '';
    background-image: url(${CameraIcon});
    background-size: contain;
    background-repeat: no-repeat;
    width: 40px;
    height: 32px;
  }

`;

export default CameraButton;