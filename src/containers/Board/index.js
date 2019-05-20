import React, { Component } from 'react'
import styled from 'styled-components'
import Lego from "../../components/Lego/"
import Form from '../../components/Form/'

const BoardContainer = styled.div`
  display: inline-flex;
  padding: 10px;
  flex-direction: column;
  align-items: center;
  min-width: 500px;
  flex-grow: 3;
  background-color: #ececec;
  min-height: calc(100vh - 20px);
`


class Board extends Component {
  constructor() {
    super()
    this.state = {
      network: [
        {
          type: 'input',
          msg: 'input (MNIST)'
        }
      ]
    }
    this.createModule = {
      type: 'create',
      msg: '+'
    }
    this.createNewLego = this.createNewLego.bind(this)
  }
  createNewLego(legoInfo) {
    this.setState({
      network: [...this.state.network, legoInfo]
    })
  }
  render() {
    let network = this.state.network.map( (e,i) => (
      <Lego
        key={`${i}-lego`}
        text={e.msg}/>
    ))
    // add create module at the last layer
    const createLego = (
      <Lego
        key={'lego-create'}
        text={this.createModule.msg}
        createNewLego={this.createNewLego}
        />
    )
    network = [...network, createLego]
    return (
      <BoardContainer>
        {network}
        <Form />
      </BoardContainer>
    )
  }
}

export default Board
