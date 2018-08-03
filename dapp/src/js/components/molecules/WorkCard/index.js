import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'
import ButtonComponent from '../../../components/atoms/Button'
import {H2,Label} from '../../../components/atoms/Text'

const WorkCardComponent = ({...props}) => {
  return (
    <Container district={props.district}>
      <Workname>{props.name}</Workname>
      <Infomations>
        <List>
          <ResourceLabel>necessary</ResourceLabel>
          <Icons>
            <Strength strength_white value={props.strength} />
            <Intelligence intelligence_white value={props.intelligence} />
          </Icons>
        </List>
        <List>
          <ResourceLabel>reward</ResourceLabel>
          <Icons>
            <Bitcoin bitcoin_white value={props.reward}/>
          </Icons>
        </List>
        <List>
          <ResourceLabel>success rate</ResourceLabel>
          <SuccessRate>{props.rate}</SuccessRate>
        </List>
        <List>
          <ResourceLabel>due date</ResourceLabel>
          <DueDate>{props.duedate}</DueDate>
        </List>
      </Infomations>
      <WorkActions>
        <Button width={'calc(50% - 30px)'}
                height={'46.5px'}
                rounded
                district={props.district}
        >{props.button1[0]}</Button>
        <Button width={'calc(50% - 30px)'}
                height={'46.5px'}
                rounded
                district={props.district}
                onClick={props.button2[1]}
        >{props.button2[0]}</Button>
      </WorkActions>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  background: linear-gradient(19deg, ${props => getDistrictColor(props, 1)} 0%, ${props => getDistrictColor(props, 2)} 100%);
  border-radius: 10px;
  overflow: hidden;
  &:before {
    position: absolute;
    top: -35px;
    right: -35px;
    content: '';
    width: 70px;
    height: 70px;
    background: rgba(255,255,255,.5);
    transform: rotate(45deg);
    transform-origin: center;
  }
  &:after {
    position: absolute;
    top: 3px;
    right: 9px;
    content: '${props => props.district}';
    color: ${Const.Color.DEFAULT};
    font-size: 22px;
    font-weight: bold;
  }
`;

const Infomations = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 0 5px;
`;

const Workname = styled(H2)`
  color: ${Const.Color.DEFAULT};
  font-size: ${Const.Size.FONT.LARGE}px;
  padding: 20px;
`;

const List = styled.li`
  border-top: 1px solid ${Const.Color.TEXT.WEAK};
  width: calc(50% - 30px);
  margin: 0 auto;
  padding: 0 0 16px;
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
`;

const ResourceLabel = styled(Label)`
  padding: 8px 0;
`;

const Strength = styled(Icon)`
  background-position: left;
  height: 26px;
  &:after {
    padding-left: 31px;
    content: '${props => props.value}';
    color: ${Const.Color.DEFAULT};
    font-size: ${Const.Size.FONT.MIDDLE}px;
    font-weight: bold;
    line-height: 23px;
  }
`;

const Intelligence = styled(Icon)`
  background-position: left;
  height: 26px;
  &:after {
    padding-left: 31px;
    content: '${props => props.value}';
    color: ${Const.Color.DEFAULT};
    font-size: ${Const.Size.FONT.MIDDLE}px;
    font-weight: bold;
    line-height: 23px;
  }
`;

const Bitcoin = styled(Icon)`
  background-position: left;
  height: 26px;
  &:after {
    padding-left: 31px;
    content: '${props => props.value}';
    color: ${Const.Color.DEFAULT};
    font-size: ${Const.Size.FONT.MIDDLE}px;
    font-weight: bold;
    line-height: 23px;
  }
`;

const SuccessRate = styled.p`
  color: ${Const.Color.DEFAULT};
  font-size: ${Const.Size.FONT.MIDDLE}px;
  font-weight: bold;
  line-height: 23px;
  &:after {
    padding-left: 3px;
    content: '%';
    color: ${Const.Color.DEFAULT};
    font-size: ${Const.Size.FONT.LOW_MIDDLE}px;
    font-weight: bold;
  }
`;

const DueDate = styled.p`
  color: ${Const.Color.DEFAULT};
  font-size: ${Const.Size.FONT.MIDDLE}px;
  font-weight: bold;
  line-height: 23px;
  &:after {
    padding-left: 3px;
    content: 'turn';
    color: ${Const.Color.DEFAULT};
    font-size: ${Const.Size.FONT.LOW_MIDDLE}px;
  }
`;

const WorkActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 5px 16.5px;
`;

const Button = styled(ButtonComponent)`
  background-color: ${Const.Color.DEFAULT};
  color: ${props => getDistrictColor(props, 1)};
  font-size: ${Const.Size.FONT.BASE}px;
  font-weight: bold;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
`;


const getDistrictColor = (props, level) => {
  if (props && level === 1) return Const.Color.DISTRICT['a'+props.district];
  if (props && level === 2) return Const.Color.DISTRICT[props.district];
}

export default WorkCardComponent