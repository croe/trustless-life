import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'

const StrengthBarComponent = ({...props}) => {
  return (
    <StrengthBar {...props}>
      <StrengthIcon strength />
      <StrengthGauge value={props.value} max={props.max} />
      <StrengthValue>{props.max}</StrengthValue>
    </StrengthBar>
  )
};

const StrengthBar = styled.div`
  position: relative;
  padding-left: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
`;

const StrengthIcon = styled(Icon)`
  position: absolute;
  display: block;
  width: 20px;
  height: 21px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const StrengthGauge = styled.div`
  position: relative;
  overflow: hidden;
  width: 71px;
  height: 13px;
  border-radius: 13px;
  background-color: ${Const.Color.BACKGROUND.GRAY};
  &:after {
    content: '${props => toggleShowValue(props)}';
    position: absolute;
    transition: all 400ms;
    width: ${props => calculateAmount(props)}px;
    height: 100%;
    top: 0;
    left: 0;
    background-color: ${Const.Color.STRENGTH};
    font-size: 11px;
    line-height: 12px;
    color: ${Const.Color.DEFAULT};
    text-align: right;
    letter-spacing: 3px;
  }
`;

const StrengthValue = styled.p`
  color: ${Const.Color.STRENGTH};
  font-size: ${Const.Size.FONT.BASE}px;
  font-weight: bold;
  padding-left: 6px;
`;

const calculateAmount = props => {
  return (props.value / props.max) * 71;
};

const toggleShowValue = props => {
  if (props.value !== 0){
    return props.value;
  }
};

export default StrengthBarComponent;