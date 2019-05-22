import React, { useContext } from 'react';
import styled from 'styled-components'
import {ContextStore} from '../../App'
import { Script } from 'vm';
import { precompile } from 'handlebars';

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
const installScripts = [
  'from keras.datasets import mnist',
  'from keras.layers import Input, Dense, Reshape, Flatten, Dropout, multiply',
  'from keras.layers import BatchNormalization, Activation, Embedding, ZeroPadding2D',
  'from keras.layers import Dense,GlobalAveragePooling2D, MaxPool2D',
  'from keras.layers.convolutional import UpSampling2D, Conv2D',
  'from keras.models import Sequential, Model, load_model',
  'from keras.optimizers import Adam',
  'from keras.preprocessing import image',
  'import matplotlib.pyplot as plt',
  'import matplotlib.gridspec as gridspec',
  'from keras.utils import to_categorical',
  'import tensorflow as tf',
  'from keras.objectives import categorical_crossentropy',
  'from keras import backend as K',
  'import numpy as np',
  'import keras'
]
const firstLine = `def createNetwork():\n\t\n\t`

const Code = () => {
  const { layers } = useContext(ContextStore)
  let installation = installScripts.reduce( (pre, val) => pre + `${val}\n`)
  let script = ''
  let isConvLayer = false
  layers.forEach((layer, index) =>{
    const input = index === 1 ? 'input' : 'x'
    switch(layer.type) {
      case 'input':
        script += `input = Input(shape=(28, 28, 1))\n\t`
        break
      case 'dense':
        if (index === 1) script += `x = Flatten()(${input})\n\t`
        if (isConvLayer) {
          script += `x = Flatten()(x)\n\t`
          isConvLayer = false
        }
        script += `x = Dense(${layer.neurons})(x)\n\t`
        break
      case 'conv2d':
        isConvLayer = true
        script += `x = Conv2D(${layer.filters},(${layer.kernelSize},${layer.kernelSize}),strides=(${layer.stride[0]},${layer.stride[1]}),padding='${layer.padding}')(${input})\n\t`
        break
      case 'max-pooling':
        script += `x = MaxPool2D(pool_size=(${layer.poolSize},${layer.poolSize}),strides=(${layer.stride[0]},${layer.stride[1]}),padding='${layer.padding}')(${input})\n\t`
        break
      case 'activation':
        script += `x = Activation('${layer.activation}')(${input})\n\t`
        break
      case 'dropout':
        script += `x = Dropout(${layer.ratio})(${input})\n\t`
        break
      default:
        script += ''
        break
    }
  })
  const lastLine = '\n\treturn Model(inputs=input, outputs=x)'
  return (
    <CodeContainer>
      <CodeScript>
          {installation + '\n\n' + firstLine + script + lastLine}
      </CodeScript>
    </CodeContainer>
  )
}

export default Code