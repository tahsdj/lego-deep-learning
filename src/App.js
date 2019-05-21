import React, { useReducer } from 'react'
import Board from './containers/Board/'
import Code from './containers/Code/'
import {networkInit, networkReducer} from './reducers/network'
import './App.css';

export const ContextStore = React.createContext({
    layers: [],
    createMode: false
})

const App = () => {
  const [network, dispatch] = useReducer(networkReducer, networkInit)
  return (
    <ContextStore.Provider 
      value={{
        ...network,
        dispatch
      }}>
      <div className="App">
        <Board />
        <Code />
      </div>
    </ContextStore.Provider>
  )
}

export default App;
