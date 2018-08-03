import React from 'react'
import styled from 'styled-components'

import Icon from '../../../components/atoms/Icon'
import {H1} from '../../../components/atoms/Text'

const UserNameContainerComponent = ({...props}) => {

  return (
    <UserNameContainer {...props}>
      <UserIcon user white />
      <UserName>{props.name}</UserName>
    </UserNameContainer>
  )
};

const UserNameContainer = styled.div`
  position: relative;
  padding-left: 37px;
  display: inline-block;
`;

const UserIcon = styled(Icon)`
  position: absolute;
  display: block;
  width: 28px;
  height: 26px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const UserName = styled(H1)`

`;

export default UserNameContainerComponent;