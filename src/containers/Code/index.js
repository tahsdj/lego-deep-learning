import React, { useContext, useEffect } from 'react';
import styled from 'styled-components'
import {ContextStore} from '../../App'
// import Prism from 'prismjs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeContainer = styled.div`
  display: inline-flex;
  max-width: 700px;
  width: 700px;
  flex-grow: 2;
  background-color: white;
  // background-color: #1d1f21;
  padding: 0 0 30px 0;
  height: calc(100vh - 30px);
  overflow-y: hidden;
`
const installScript =`
from keras.datasets import mnist
from keras.layers import Input, Dense, Reshape, Flatten, Dropout, multiply
from keras.layers import BatchNormalization, Activation
from keras.layers import GlobalAveragePooling2D, MaxPool2D
from keras.layers.convolutional import UpSampling2D, Conv2D
from keras.models import Model, load_model
from keras.optimizers import Adam
from keras.utils import to_categorical
from keras.objectives import categorical_crossentropy
from keras import backend as K
import numpy as np
import keras
`

const dataScript = `
(x_train, y_train), (x_test, y_test) = mnist.load_data()
y_train = to_categorical(y_train)
y_test = to_categorical(y_test)
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.
`
const firstLine = `def createNetwork():\n\t`

const complieScript = `
model = createNetwork()
model.compile(
  loss='categorical_crossentropy',
  optimizer=Adam(1e-3)
  metrics=['accuracy']),
  batch_size = 128,
  epochs = 20,
  history = model.fit(x_train, y_train,
  batch_size=batch_size,
  epochs=epochs,
  verbose=1,
  validation_data=(x_test, y_test)
)
`

const lastLine = '\n\treturn Model(inputs=input, outputs=x)'

const Code = () => {
  const { layers } = useContext(ContextStore)

  let script = ''
  let isConvLayer = false
  layers.forEach((layer, index) =>{
    const input = index === 1 ? 'input' : 'x'
    switch(layer.type) {
      case 'input':
        script += `input = Input(shape=(28, 28))\n\t`
        break
      case 'Dense':
        if (index === 1) script += `x = Flatten()(${input})\n\t`
        if (isConvLayer) {
          script += `x = Flatten()(x)\n\t`
          isConvLayer = false
        }
        script += `x = Dense(${layer.neurons})(x)\n\t`
        break
      case 'Conv2D':
        isConvLayer = true
        script += `x = Conv2D(${layer.filters},(${layer.kernelSize},${layer.kernelSize}),strides=(${layer.stride[0]},${layer.stride[1]}),padding='${layer.padding}')(${input})\n\t`
        break
      case 'Max pooling':
        script += `x = MaxPool2D(pool_size=(${layer.poolSize},${layer.poolSize}),strides=(${layer.stride[0]},${layer.stride[1]}),padding='${layer.padding}')(${input})\n\t`
        break
      case 'Activation':
        script += `x = Activation('${layer.activation}')(${input})\n\t`
        break
      case 'Dropout':
        script += `x = Dropout(${layer.ratio})(${input})\n\t`
        break
      default:
        script += ''
        break
    }
  })

  return (
    <CodeContainer>
      <SyntaxHighlighter language="python" customStyle={{"margin": '0',"width": "calc(100% - 2em)","height": "calc(100vh - 2em)", "font-size": '0.8em'}}>
          {installScript + '\n' + dataScript + '\n' + firstLine + script + lastLine + '\n' + complieScript + '\n\n'}
      </SyntaxHighlighter>
    </CodeContainer>
  )
}

export default Code