import styled from "styled-components"

import User from './icons/user.png'
import UserWhite from './icons/user-white.png'
import Strength from './icons/strength.png'
import StrengthWhite from './icons/strength-white.png'
import Intelligence from './icons/intelligence.png'
import IntelligenceWhite from './icons/intelligence-white.png'
import Bitcoin from './icons/bitcoin.png'
import BitcoinWhite from './icons/bitcoin-white.png'
import BitcoinBlue from './icons/bitcoin-blue.png'
import Energy from './icons/energy.png'
import EnergyBlue from './icons/eneygy-blue.png'
import EnergyWhite from './icons/energy-white.png'
import Car from './icons/car.png'
import House from './icons/house.png'
import ArrowUp from './icons/arrow-up.png'
import ArrowDown from './icons/arrow-down.png'
import Check from './icons/check.png'
import Chart from './icons/chart.png'
import List from './icons/list.png'
import Market from './icons/market.png'
import Menu from './icons/menu.png'

const Icon = styled.span`
  background-image: url(${props => getIconName(props)});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const getIconName = props => {
  if (props.user) return User;
  if (props.user_white) return UserWhite;
  if (props.strength) return Strength;
  if (props.strength_white) return StrengthWhite;
  if (props.intelligence) return Intelligence;
  if (props.intelligence_white) return IntelligenceWhite;
  if (props.bitcoin) return Bitcoin;
  if (props.bitcoin_white) return BitcoinWhite;
  if (props.bitcoin_blue) return BitcoinBlue;
  if (props.energy) return Energy;
  if (props.energy_white) return EnergyWhite;
  if (props.energy_blue) return EnergyBlue;
  if (props.arrowup) return ArrowUp;
  if (props.arrowdown) return ArrowDown;
  if (props.car) return Car;
  if (props.house) return House;
  if (props.check) return Check;
  if (props.chart) return Chart;
  if (props.listed) return List;
  if (props.market) return Market;
  if (props.menu) return Menu;
}

export default Icon;