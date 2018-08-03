import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'

const EnergiesComponent = ({...props}) => {
  return (
    <Energys>
      <EnergyIcon energy/>
      <EnergyAmount>{props.value}</EnergyAmount>
    </Energys>
  )
};

const Energys = styled.div`
  position: relative;
  padding-left: 13.5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  margin-right: 17.5px;
`;

const EnergyIcon = styled(Icon)`
  position: absolute;
  display: block;
  width: 10.5px;
  height: 17.5px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const EnergyAmount = styled.p`
  color: ${Const.Color.PRIMARY};
  font-size: ${Const.Size.FONT.BASE}px;
  font-weight: bold;
`;

export default EnergiesComponent