import React, { useContext } from 'react';
import styled from 'styled-components'
import {ContextStore} from '../../App'
import { Script } from 'vm';

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
  white-space: pre-wrap;
`

const firstLine = `def createNetwork():\n\t`

const Code = () => {
  console.log('code init')
  const { layers } = useContext(ContextStore)
  let script = ''
  layers.forEach((layer, index) =>{
    switch(layer.type) {
      case 'input':
        script += `x = Input(shape=(28, 28, 1))\n\t`
        break
      case 'dense':
        if (index === 1) script += `x = Flatten()(x)\n\t`
        script += `x = Dense(${layer.neurons})(x)\n\t`
        break
      case 'conv2d':
        script += `x = Conv2D(${layer.filters},(${layer.kernelSize},${layer.kernelSize}),strides=(${layer.stride[0]},${layer.stride[1]}),padding='${layer.padding}')(x)\n\t`
        break
      case 'max-pooling':
        script += `x = MaxPool2D(pool_size=(${layer.poolSize},${layer.poolSize}),strides=(${layer.stride[0]},${layer.stride[1]}),padding='${layer.padding}')(x)\n\t`
        break
      case 'activation':
        script += `x = Activation('${layer.activation}')(x)\n\t`
        break
      case 'dropout':
        script += `x = Dropout(${layer.ratio}(x))`
        break
      default:
        script += ''
        break
    }
  })
  return (
    <CodeContainer>
      <CodeScript>
          {firstLine + script}
      </CodeScript>
    </CodeContainer>
  )
}

export default Code