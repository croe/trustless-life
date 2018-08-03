import React from 'react'
import styled from 'styled-components'

import Icon from '../../../components/atoms/Icon'
import {H1} from '../../../components/atoms/Text'
import CameraUploaderContainer from '../../../components/atoms/CameraUploader'
import Hexagon from '../../../components/molecules/Hexagon'

const UserPhotoContainerComponent = ({...props}) => {

  return (
    <UserPhotoContainer {...props}>
      <UserPhoto>
        <Hexagon
          width={124}
        />
        <CameraUploader />
      </UserPhoto>
      <UserName>{`akihiro`}</UserName>
    </UserPhotoContainer>
  )

};

const UserPhotoContainer = styled.div`
  position: relative;
  padding: 35px 0;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
`;

const UserPhoto = styled.div`
  position: relative;
`;

const UserName = styled(H1)`
  text-align: center;
  padding: 8px 0 0;
`;

const CameraUploader = styled(CameraUploaderContainer)`
  position: absolute;
  bottom: -30px;
  right: 0;
  z-index: 10;
`;

export default UserPhotoContainerComponent;