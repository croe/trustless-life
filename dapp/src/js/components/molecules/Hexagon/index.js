import React from 'react'
import styled from 'styled-components'

const Hexagon = ({...props}) => {

  return (
    <HexagonWrapper
      width={props.width}
    >
      <HexagonTop
        width={props.width}
      />
      <HexagonBottom
        width={props.width}
      />
    </HexagonWrapper>
  )

}

const HexagonWrapper = styled.div`
  position: relative;
  background-image: url(/assets/images/photo.jpg);
  background-position: center;
  ${props => getHexagonWrapperSize(props.width)}
  &:after {
    content: "";
    position: absolute;
    top: 0.0000px;
    left: 0;
    width: ${props => {return props.width}};
    height: ${props => {return props.width}};
    z-index: 2;
    background: inherit;
  }
`;

const HexagonTop = styled.div`
  position: absolute;
  z-index: 1;
  ${props => getHexagonTriangleSize(props.width)}
  top: ${props => {return (props.width / Math.sqrt(2)) / -2}}px;
  overflow: hidden;
  transform: scaleY(0.57735026919) rotate(-45deg);
  background: inherit;
  &:after {
    content: "";
    position: absolute;
    width: ${props => {return props.width}}px;
    height: ${props => {return props.width * 0.57735026919}}px;
    transform: rotate(45deg) scaleY(${Math.sqrt(3)}) translateY(${props => {return props.width * 0.57735026919 / -2}}px);
    transform-origin: 0 0;
    background: inherit;
    background-position: center top;
  }
`;

const HexagonBottom = styled.div`
  position: absolute;
  z-index: 1;
  ${props => getHexagonTriangleSize(props.width)}
  bottom: ${props => {return (props.width / Math.sqrt(2)) / -2}}px;
  overflow: hidden;
  transform: scaleY(0.57735026919) rotate(-45deg);
  background: inherit;
  &:after {
    content: "";
    position: absolute;
    width: ${props => {return props.width}}px;
    height: ${props => {return props.width * 0.57735026919}}px;
    transform: rotate(45deg) scaleY(${Math.sqrt(3)}) translateY(${props => {return props.width * 0.57735026919 / -2}}px);
    transform-origin: 0 0;
    background: inherit;
    background-position: center bottom;
  }
`;



const getHexagonWrapperSize = width => {
  return {
    width: `${width}px`,
    height: `${width / Math.sqrt(3)}px`,
    margin: `${width / Math.sqrt(3) / 2}px auto`,
    backgroundSize: `auto ${width / Math.sqrt(3) * 2}px`
  }
}

const getHexagonTriangleSize = (width, pos) => {
  return {
    width: `${width / Math.sqrt(2)}px`,
    height: `${width / Math.sqrt(2)}px`,
    left: `${(width - (width / Math.sqrt(2))) / 2}px`,
  }
}

const hexToRgb = hex => {
  //strip off hash character
  hex = hex.substring(1);
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return r + "," + g + "," + b;
}

export default Hexagon;