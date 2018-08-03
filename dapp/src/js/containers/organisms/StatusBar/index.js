import React from 'react'
import styled from 'styled-components'
import { pure } from 'recompose'

import StrengthBarComponent from '../../../components/molecules/StrengthBar'
import IntelligenceBarComponent from '../../../components/molecules/IntelligenceBar'
import BitcoinsComponent from '../../../components/molecules/Bitcoins'
import EnergiesComponent from '../../../components/molecules/Energies'
import Const from "../../../const";

export default pure(function StatusBar(props) {
  const {status} = props;
  return (
    <Container>
      <StrengthBar
        value={status.strength.value}
        max={status.strength.max}
      />
      <IntelligenceBar
        value={status.intelligence.value}
        max={status.intelligence.max}
      />
      <Energies
        value={status.energy.value}
        max={status.energy.max}
      />
      <Bitcoins
        value={status.bitcoin.value}
        max={status.bitcoin.max}
      />
    </Container>
  )

})

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid ${Const.Color.BORDER.GRAY};
`;

const StrengthBar = styled(StrengthBarComponent)`
  margin-right: 17.5px;
`;

const IntelligenceBar = styled(IntelligenceBarComponent)`
  margin-right: 17.5px;
`;

const Bitcoins = styled(BitcoinsComponent)`
`;

const Energies = styled(EnergiesComponent)`
`;