import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
// import * as Animated from "animated/lib/targets/react-dom";
import Const from '../../../const'

class Modal extends Component {
  constructor(props) {
    super(props);
    this.rootEl = document.getElementById('root');
  }

  render() {
    return (
      this.props.isOpen
    ) ? (
      ReactDOM.createPortal(
        <ModalWrapper className={`is-show`} onClick={this.props.onClose}>
          <ModalContent>
            {/*<button >Close</button>*/}
            {this.props.render()}
          </ModalContent>
        </ModalWrapper>,
        this.rootEl)
    ) : (
      ReactDOM.createPortal(
        <ModalWrapper />,
        this.rootEl
      )
    )
  }
}

export default Modal;

const ModalWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: calc(100% - 112px);
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: flex-start;
  top: 112px;
  left: 0;
  z-index: 100;
  overflow: auto;
  &.is-show {
    display: flex;
  }
`;

const ModalContent = styled.div`
  position: relative;
  width: calc(100% - 40px);
  height: auto;
  top: 20px;
  left: 0;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  background-color: ${Const.Color.BACKGROUND.WHITE};
`;