import React, { Component, useReducer, useContext } from 'react'
import styled from 'styled-components'
import Lego from "../../components/Lego/"
import Form from '../../components/Form/'
import {networkInit, networkReducer} from '../../reducers/network'
import {ContextStore} from '../../App'

const BoardContainer = styled.div`
  display: inline-flex;
  position: relative;
  padding: 10px;
  flex-direction: column;
  align-items: center;
  min-width: 500px;
  flex-grow: 3;
  background-color: #ececec;
  min-height: calc(100vh - 20px);
  max-height: calc(100vh - 20px);
  overflow-y: auto;
`


const Board = () => {
  // const [{layers, createMode}, dispatch] = useReducer(networkReducer, networkInit)
  const { layers, createMode, dispatch } = useContext(ContextStore)

  let network = layers.map( (e,i) => (
    <Lego
      key={`${i}-lego`}
      text={e.msg}
      type={e.type}
      index={i}
      dispatch={dispatch}
      />
  ))
  // add create module at the last layer
  const createLego = (
    <Lego
      key={'lego-create'}
      text={'+'}
      dispatch={dispatch}
      />
  )
  network = [...network, createLego]
    return (
      <BoardContainer>
        {network}
        { createMode && <Form dispatch={dispatch}/>}
      </BoardContainer>
    )
  
}

export default Board
