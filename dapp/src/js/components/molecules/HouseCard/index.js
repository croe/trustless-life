import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'
import ButtonComponent from '../../../components/atoms/Button'
import {H2,Label} from '../../../components/atoms/Text'

const HouseCardComponent = ({...props}) => {

  return (
    <Container district={props.district}>
      <Workname><Icon house />{props.name}</Workname>
      <Infomations>
        <List>
          <ResourceLabel>necessary</ResourceLabel>
          <Icons>
            <Bitcoin bitcoin_white value={props.contract.req.fee}/>
          </Icons>
        </List>
        <List>
          <ResourceLabel>recovery</ResourceLabel>
          <Icons>
            <Strength strength_white value={props.contract.res.strength}/>
            <Intelligence intelligence_white value={props.contract.res.intelligence} />
            <Energy energy_white value={props.contract.res.energy} />
          </Icons>
        </List>
      </Infomations>
      <HouseContract>
        <Button width={'50%'}
                height={'46.5px'}
                rounded
                district={props.district}
        >{(props.contract.req.credit > props.status.credit) ? 'Sign a rental contract' : ''}</Button>
      </HouseContract>
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
  flex-wrap: wrap;
`;

const ResourceLabel = styled(Label)`
  padding: 8px 0;
`;

const House = styled(Icon)`

`;


const Strength = styled(Icon)`
  background-position: left;
  width: 50%;
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
  width: 50%;
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

const Energy = styled(Icon)`
  background-position: left;
  margin: 10px 0 0;
  width: 50%;
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

const HouseContract = styled.div`
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

export default HouseCardComponent