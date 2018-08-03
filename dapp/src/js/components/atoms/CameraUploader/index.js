import styled from 'styled-components'
import Const from '../../../const'

import CameraIcon from './camera.png'

const CameraUploader = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${Const.Color.BACKGROUND.GRAY};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${Const.Color.DEFAULT};
  &:after {
    content: '';
    background-image: url(${CameraIcon});
    background-size: contain;
    background-repeat: no-repeat;
    width: 20px;
    height: 16px;
  }

`;

export default CameraUploader;