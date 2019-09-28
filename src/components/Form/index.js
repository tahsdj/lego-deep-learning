import React, { Component, useState, useContext } from 'react'
import styled from 'styled-components'
import CloseIcon from '../../icons/close.png'
import {ContextStore} from '../../App'

const FormContainer = styled.div`
  display: inline-flex;
  position: fixed;
  top: 120px;
  left: 50%;
  width: calc(100vh - 40px);
  max-width: 400px;
  background-color: white;
  transform: translate(-50%,0%);
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  border: .5px solid gray;
`

const Close = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`
const FormData = {
    layers: [
        {
            type: 'Dense',
            nuerons: 128
        },
        {
            type: 'Conv2D',
            kernelSize: [
                '1x1',
                '2x2',
                '3x3',
                '4x4',
                '5x5'
            ],
            filters: 16,
            stride: [1,1],
            padding: ['Same', 'Solid']
        },
        {
            type: 'Max pooling',
            poolSize: [
                '2x2',
                '3x3',
                '4x4',
                '5x5'
            ],
            stride: [1,1],
            padding: ['Same', 'Solid']
        },
        {
            type: 'Activation',
            activations: [
                'Relu',
                'Sigmoid',
                'Softmax',
                'Tanh'
            ]
        },
        {
            type: 'Dropout',
            ratio: 0.5
        }
    ]
}

const dict = {
    'Dense': 0,
    'Conv2D': 1,
    'Max pooling': 2,
    'Activation': 3,
    'Dropout': 4
}


const Form = () => {
    // use sate control from hook
    const {edit, currentIndex, layers, dispatch } = useContext(ContextStore)
    
    const currentLayer = layers[currentIndex]
    const [layer, setLayer] = useState(edit?dict[currentLayer.type]:0)
    
    const layerButtons = FormData.layers.map( (e,i) =>(
        <Button
            key={`${i}-btn`} 
            type="layer"
            selected={ i === layer ? true : false}
            text={e.type}
            clickCallback={()=>setLayer(i)}
            />
    ))
    return (
        <FormContainer>
            <Close 
                src={CloseIcon} 
                onClick={()=>dispatch({type: "CREATE_MODE", mode: false})}
                />
            <Row label="Layer">
                {layerButtons}
            </Row>
            {
                (() => {
                    switch(layer) {
                        case 0:
                            return edit? <DenseForm n={currentLayer.nuerons}/> : <DenseForm />
                        case 1:
                            return edit? 
                                <ConvForm 
                                    kSize={currentLayer.kernelSize} 
                                    _filters={currentLayer.filters} 
                                    _strideW={currentLayer.stride[0]} 
                                    _strideH={currentLayer.stride[1]} 
                                    padding={currentLayer.padding} /> : <ConvForm />
                        case 2:
                            return edit ?
                                <MaxPoolingForm 
                                    poolingSize={currentLayer.poolingSize} 
                                    _strideW={currentLayer.stride[0]} 
                                    _strideH={currentLayer.stride[1]} 
                                    padding={currentLayer.padding} /> : <MaxPoolingForm />
                        case 3:
                            return edit ?
                                <ActivationForm type={currentLayer.activation} /> : <ActivationForm />
                        case 4:
                            return edit ?
                                <DropoutForm _ratio={currentLayer.ratio} /> : <DropoutForm />
                        default:
                            return null
                    }
                })()
            }
        </FormContainer>
    )
}

export default Form

const RowStyled = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 5px;
    width: calc(100%);
`

const RowSection = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    margin-top: 5px;
    width: calc(100%);
    flex-direction: ${ props => props.reverse ? 'row-reverse' : 'row'};
`

const Row = (props) => (
    <RowStyled>
        { props.label ? `${props.label}: ` : null}
        <RowSection reverse={props.reverse}>
            {props.children}
        </RowSection>
    </RowStyled>
)


const ButtonLayout = styled.button`
    outline: none;
    padding: 5px 10px;
    background-color: ${props => props.selected ? '#44B8CB':'white'};
    border: .5px solid #707070;
    border-radius: 10px;
    margin: 0 10px 10px 0;
    color: ${props => props.selected ? 'white':'#707070'};
    cursor: pointer;
`


const Button = (props) => {
    return (
        <ButtonLayout
            selected={props.selected}
            onClick={()=>props.clickCallback()}
        >
            {props.text}
        </ButtonLayout>
    )
}

const SubFormContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    width: calc(100%);
    margin-top: 10px;
`
const Input = styled.input`
    border: .5px solid #707070;
    outline: none;
    border-radius: 5px;
    padding: 5px;
    margin: 0 5px 10px 0;
    width: 50px;
`
const ConvForm = ({kSize="3", _filters=32, _strideH=1, _strideW=1, padding="Solid"}) => {
    
    const kSizeDict = {"1":0 ,"2": 1, "3": 2, "4": 3, "5": 4}
    const paddingDict = { "Same": 0, "Solid": 1}

    const { edit, dispatch } = useContext(ContextStore)
    const [kIndex, setkIndex] = useState(kSizeDict[kSize])
    const [filters, setFilters] = useState(_filters)
    const [strideH, setStritedH] = useState(_strideH)
    const [strideW, setStritedW] = useState(_strideW)
    const [paddingIndex, setPaddingIndex] = useState(paddingDict[padding])

    const kernelButtons = FormData.layers[1].kernelSize.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`} 
            type="kernel"
            selected={ i === kIndex ? true : false}
            clickCallback={() => setkIndex(i)}
            text={e}
            />
    ))
    const paddingButtons = FormData.layers[1].padding.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`}
            type="padding"
            selected={ i === paddingIndex ? true : false}
            text={e}
            clickCallback={()=>setPaddingIndex(i)}
            />
    ))

    return (
        <SubFormContainer>
            <Row label="Kernel size">
                {kernelButtons}
            </Row>
            <Row label="Filters">
                <Input value={filters} onChange={ e=>setFilters(e.target.value)}/>
            </Row>
            <Row label="Stride">
                <Input placeholder="width" value={strideW} onChange={ e=>setStritedW(e.target.value)}/>
                <Input placeholder="heigh" value={strideH} onChange={ e=>setStritedH(e.target.value)}/>
            </Row>
            <Row label="Padding">
                {paddingButtons}
            </Row>
            <Row reverse={true}>
                <Button
                    key={`confirm`} 
                    type="confirm"
                    selected={ false}
                    text={'OK'}
                    clickCallback={()=>{
                        const ksize = FormData.layers[1].kernelSize[kIndex][0]
                        const layer = {
                            type: 'Conv2D',
                            msg: `Conv2D (${ksize}x${ksize}) x ${filters}`,
                            stride: [strideW, strideH],
                            filters: filters,
                            kernelSize: ksize,
                            padding: FormData.layers[1].padding[paddingIndex]
                        }
                        dispatch({
                            type: edit ? 'EDIT_LAYER': 'ADD_LAYER',
                            layer: layer
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}


const DenseForm = ({n=256}) => {
    const [neurons, setNeurons] = useState(n)
    const { edit, dispatch } = useContext(ContextStore)
    return (
        <SubFormContainer>
            <Row label="Neurons">
                <Input value={neurons} onChange={ e=>setNeurons(e.target.value)}/>
            </Row>
            <Row reverse={true}>
                <Button
                    key={`confirm`} 
                    type="confirm"
                    selected={ false}
                    text={'OK'}
                    clickCallback={()=>{
                        const layer = {
                            type: 'Dense',
                            msg: `Dense (${neurons})`,
                            neurons: neurons
                        }
                        dispatch({
                            type:  edit ? 'EDIT_LAYER': 'ADD_LAYER',
                            layer: layer
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}

const MaxPoolingForm = ({poolingSize="3x3", _strideH=2, _strideW=2, padding="Same"}) => {
    const poolingDict = { "2x2": 0, "3x3": 1, "4x4": 2, "5x5": 3}
    const paddingDict = { "Same": 0, "Solid": 1}

    const { edit, dispatch } = useContext(ContextStore)
    const [poolingIndex, setpoolingIndex] = useState(poolingDict[poolingSize])
    const [strideH, setStritedH] = useState(_strideH)
    const [strideW, setStritedW] = useState(_strideW)
    const [paddingIndex, setPaddingIndex] = useState(paddingDict[padding])

    const poolButtons = FormData.layers[2].poolSize.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`} 
            type="kernel"
            selected={ i === poolingIndex ? true : false}
            clickCallback={() => setpoolingIndex(i)}
            text={e}
            />
    ))
    const paddingButtons = FormData.layers[2].padding.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`}
            type="padding"
            selected={ i === paddingIndex ? true : false}
            text={e}
            clickCallback={()=>setPaddingIndex(i)}
            />
    ))

    return (
        <SubFormContainer>
            <Row label="Pool size">
                {poolButtons}
            </Row>
            <Row label="Stride">
                <Input placeholder="width" value={strideW} onChange={ e=>setStritedW(e.target.value)}/>
                <Input placeholder="heigh" value={strideH} onChange={ e=>setStritedH(e.target.value)}/>
            </Row>
            <Row label="Padding">
                {paddingButtons}
            </Row>
            <Row reverse={true}>
                <Button
                    key={`confirm`} 
                    type="confirm"
                    selected={ false}
                    text={'OK'}
                    clickCallback={()=>{
                        const psize = FormData.layers[2].poolSize[poolingIndex][0]
                        const layer = {
                            type: 'Max pooling',
                            msg: `Max Pooling (${psize}x${psize})`,
                            stride: [strideW, strideH],
                            poolSize: psize,
                            padding: FormData.layers[2].padding[paddingIndex]
                        }
                        dispatch({
                            type: edit ? 'EDIT_LAYER': 'ADD_LAYER',
                            layer: layer
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}


const ActivationForm = ({type="relu"}) => {
    const actionTypeDict={ "relu": 0, "sigmoid": 1, "softmax": 2, "tanh": 3}

    const { edit, dispatch } = useContext(ContextStore)
    const [aIndex, setaIndex] = useState(actionTypeDict[type])

    const activationButtons = FormData.layers[3].activations.map( (e,i) =>(
        <Button
            key={`${i}-activation`}
            type="activation"
            selected={ i === aIndex ? true : false}
            text={e}
            clickCallback={()=>setaIndex(i)}
            />
    ))
    return (
        <SubFormContainer>
            <Row label="Activations">
                {activationButtons}
            </Row>
            <Row reverse={true}>
                <Button
                    key={`confirm`} 
                    type="confirm"
                    selected={ false}
                    text={'OK'}
                    clickCallback={()=>{
                        const activations = FormData.layers[3].activations
                        const layer = {
                            type: 'Activation',
                            msg: `Activation (${activations[aIndex]})`,
                            activation: activations[aIndex].toLowerCase()
                        }
                        dispatch({
                            type: edit ? 'EDIT_LAYER': 'ADD_LAYER',
                            layer: layer
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}

const DropoutForm = ({_ratio=0.5}) => {
    const { edit, dispatch } = useContext(ContextStore)
    const [ratio, setRatio] = useState(_ratio)
    return (
        <SubFormContainer>
            <Row label="Ratio">
                <Input placeholder={"set 0~1"} value={ratio} onChange={ e=>setRatio(e.target.value)}/>
            </Row>
            <Row reverse={true}>
                <Button
                    key={`confirm`} 
                    type="confirm"
                    selected={ false}
                    text={'OK'}
                    clickCallback={()=>{
                        const layer = {
                            type: 'Dropout',
                            msg: `Dropout (${ratio})`,
                            ratio: ratio
                        }
                        dispatch({
                            type: edit ? 'EDIT_LAYER': 'ADD_LAYER',
                            layer: layer
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}

