import React, { useContext } from 'react';
import styled from 'styled-components'
import {ContextStore} from '../../App'
import { Script } from 'vm';
import { precompile } from 'handlebars';

const CodeContainer = styled.div`
  display: inline-flex;
  max-width: 700px;
  width: 700px;
  flex-grow: 2;
  background-color: black;
  padding: 0 0 30px 0;
  height: calc(100vh - 30px);
  overflow-y: auto;
`
const CodeScript = styled.code`
  display: inline-flex;
  flex-direction: column;
  padding: 10px;
  color: white;
  white-space: pre-wrap;
`
const installScripts = [
  'from keras.datasets import mnist\n',
  'from keras.layers import Input, Dense, Reshape, Flatten, Dropout, multiply',
  'from keras.layers import BatchNormalization, Activation',
  'from keras.layers import GlobalAveragePooling2D, MaxPool2D',
  'from keras.layers.convolutional import UpSampling2D, Conv2D',
  'from keras.models import Model, load_model',
  'from keras.optimizers import Adam',
  'from keras.utils import to_categorical',
  'from keras.objectives import categorical_crossentropy',
  'from keras import backend as K',
  'import numpy as np',
  'import keras'
]

const dataScripts = [
  '(x_train, y_train), (x_test, y_test) = mnist.load_data()\n',
  'y_train = to_categorical(y_train)',
  'y_test = to_categorical(y_test)',
  `x_train = x_train.astype('float32') / 255.`,
  `x_test = x_test.astype('float32') / 255.`
]
const firstLine = `def createNetwork():\n\t\n\t`

const complieScripts = [
  'model = createNetwork()\n',
  `model.compile(loss='categorical_crossentropy',
  \t\toptimizer=Adam(1e-3),
  \t\tmetrics=['accuracy'])\n`,
  `batch_size = 128`,
  `epochs = 20`,
  `history = model.fit(x_train, y_train,
    \t\tbatch_size=batch_size,
    \t\tepochs=epochs,
    \t\tverbose=1,
    \t\tvalidation_data=(x_test, y_test))`
]

const Code = () => {
  const { layers } = useContext(ContextStore)
  const installation = installScripts.reduce( (pre, val) => pre + `${val}\n`)
  const dataset = dataScripts.reduce( (pre, val) => pre + `${val}\n`)
  const complie = complieScripts.reduce( (pre, val) => pre + `${val}\n`)
  let script = ''
  let isConvLayer = false
  layers.forEach((layer, index) =>{
    const input = index === 1 ? 'input' : 'x'
    switch(layer.type) {
      case 'input':
        script += `input = Input(shape=(28, 28))\n\t`
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
          {installation + '\n\n' + dataset + '\n\n' + firstLine + script + lastLine + '\n\n' + complie + '\n\n'}
      </CodeScript>
    </CodeContainer>
  )
}

export default Code