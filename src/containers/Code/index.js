import React, { Component } from 'react';
import styled from 'styled-components'

const CodeContainer = styled.div`
  display: inline-flex;
  max-width: 550px;
  width: 400px;
  flex-grow: 2;
  background-color: black;
  height: 100vh;
`
const CodeScript = styled.code`
  display: inline-flex;
  flex-direction: column;
  padding: 10px;
  color: white;
`

const Line = styled.span`
    color: white;
    height: 15px;
    padding-left: ${props => props.indent? `${props.indent*15}px` : '0px'};
`

class Code extends Component {
  render() {
    return (
      <CodeContainer>
        <CodeScript>
            <Line >def createNet():</Line>
            {/* <Line ></Line>
            <Line ></Line> */}
            <Line indent={1}>return model</Line>
        </CodeScript>
      </CodeContainer>
    )
  }
}

export default Code
