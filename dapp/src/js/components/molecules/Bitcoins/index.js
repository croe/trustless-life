import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'

const BitcoinsComponent = ({...props}) => {
  return (
    <Bitcoins>
      <BitcoinIcon bitcoin/>
      <BitcoinAmount>{props.value}</BitcoinAmount>
    </Bitcoins>
  )
};

const Bitcoins = styled.div`
  position: relative;
  padding-left: 17px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
`;

const BitcoinIcon = styled(Icon)`
  position: absolute;
  display: block;
  width: 12.5px;
  height: 17px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const BitcoinAmount = styled.p`
  color: ${Const.Color.PRIMARY};
  font-size: ${Const.Size.FONT.BASE}px;
  font-weight: bold;
`;

export default BitcoinsComponent