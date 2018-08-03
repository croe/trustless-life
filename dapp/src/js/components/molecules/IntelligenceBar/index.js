import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'

const IntelligenceBarComponent = ({...props}) => {
  return (
    <IntelligenecBar {...props}>
      <IntelligenceIcon intelligence />
      <IntelligenceGauge value={props.value} max={props.max} />
      <IntelligenceValue>{props.max}</IntelligenceValue>
    </IntelligenecBar>
  )
};

const IntelligenecBar = styled.div`
  position: relative;
  padding-left: 22.5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
`;

const IntelligenceIcon = styled(Icon)`
  position: absolute;
  display: block;
  width: 17.5px;
  height: 23.5px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const IntelligenceGauge = styled.div`
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
    width: ${props => calcurateAmount(props)}px;
    height: 100%;
    top: 0;
    left: 0;
    background-color: ${Const.Color.INTELLIGENCE};
    font-size: 11px;
    line-height: 12px;
    color: ${Const.Color.DEFAULT};
    text-align: right;
    letter-spacing: 3px;
  }
`;

const IntelligenceValue = styled.p`
  color: ${Const.Color.INTELLIGENCE};
  font-size: ${Const.Size.FONT.BASE}px;
  font-weight: bold;
  padding-left: 6px;
`;

const calcurateAmount = (props) => {
  return (props.value / props.max) * 71;
}

const toggleShowValue = props => {
  if (props.value !== 0){
    return props.value;
  }
};

export default IntelligenceBarComponent;