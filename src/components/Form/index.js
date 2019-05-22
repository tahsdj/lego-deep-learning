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


const Form = () => {
    // use sate control from hook
    const [layer, setLayer] = useState(0)
    const { dispatch } = useContext(ContextStore)

    const layerButtons = FormData.layers.map( (e,i) =>(
        <Button
            key={`${i}-btn`} 
            type="layer"
            selected={ i === layer ? true : false}
            text={e.type}
            selectLayer={()=>setLayer(i)}
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
                            return <DenseForm/>
                        case 1:
                            return <ConvForm/>
                        case 2:
                            return <MaxPoolingForm />
                        case 3:
                            return <ActivationForm />
                        case 4:
                            return <DropoutForm />
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
            onClick={()=>{
                switch(props.type) {
                    case 'layer':
                        props.selectLayer()
                        break
                    case 'kernel':
                        props.selectKernelSize()
                        break
                    case 'padding':
                        props.selectPadding()
                        break
                    case 'activation':
                        props.selectActivation()
                        break
                    case 'confirm':
                        props.confirm()
                        break
                }
            }}
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
const ConvForm = () => {
    const [kIndex, setkIndex] = useState(2)
    const [filters, setFilters] = useState(32)
    const [strideH, setStritedH] = useState(1)
    const [strideW, setStritedW] = useState(1)
    const [paddingIndex, setPaddingIndex] = useState(0)
    const { dispatch } = useContext(ContextStore)

    const kernelButtons = FormData.layers[1].kernelSize.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`} 
            type="kernel"
            selected={ i === kIndex ? true : false}
            selectKernelSize={() => setkIndex(i)}
            text={e}
            />
    ))
    const paddingButtons = FormData.layers[1].padding.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`}
            type="padding"
            selected={ i === paddingIndex ? true : false}
            text={e}
            selectPadding={()=>setPaddingIndex(i)}
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
                    confirm={()=>{
                        const ksize = FormData.layers[1].kernelSize[kIndex][0]
                        const layer = {
                            type: 'conv2d',
                            msg: `Conv2D (${ksize}x${ksize}) x ${filters}`,
                            stride: [strideW, strideH],
                            filters: filters,
                            kernelSize: ksize,
                            padding: FormData.layers[1].padding[paddingIndex]
                        }
                        dispatch({
                            type: 'ADD_LAYER',
                            layer: layer,
                            mode: false
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}


const DenseForm = () => {
    const [neurons, setNeurons] = useState(256)
    const { dispatch } = useContext(ContextStore)
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
                    confirm={()=>{
                        const layer = {
                            type: 'dense',
                            msg: `Dense (${neurons})`,
                            neurons: neurons
                        }
                        dispatch({
                            type: 'ADD_LAYER',
                            layer: layer,
                            mode: false
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}

const MaxPoolingForm = () => {
    const [poolingIndex, setpoolingIndex] = useState(1)
    const [strideH, setStritedH] = useState(2)
    const [strideW, setStritedW] = useState(2)
    const [paddingIndex, setPaddingIndex] = useState(0)
    const { dispatch } = useContext(ContextStore)

    const poolButtons = FormData.layers[2].poolSize.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`} 
            type="kernel"
            selected={ i === poolingIndex ? true : false}
            selectKernelSize={() => setpoolingIndex(i)}
            text={e}
            />
    ))
    const paddingButtons = FormData.layers[2].padding.map( (e,i) =>(
        <Button
            key={`${i}-conv2d-kernel`}
            type="padding"
            selected={ i === paddingIndex ? true : false}
            text={e}
            selectPadding={()=>setPaddingIndex(i)}
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
                    confirm={()=>{
                        const psize = FormData.layers[2].poolSize[poolingIndex][0]
                        const layer = {
                            type: 'max-pooling',
                            msg: `Max Pooling (${psize}x${psize})`,
                            stride: [strideW, strideH],
                            poolSize: psize,
                            padding: FormData.layers[2].padding[paddingIndex]
                        }
                        dispatch({
                            type: 'ADD_LAYER',
                            layer: layer,
                            mode: false
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}


const ActivationForm = () => {
    const [aIndex, setaIndex] = useState(0)
    const { dispatch } = useContext(ContextStore)

    const activationButtons = FormData.layers[3].activations.map( (e,i) =>(
        <Button
            key={`${i}-activation`}
            type="activation"
            selected={ i === aIndex ? true : false}
            text={e}
            selectActivation={()=>setaIndex(i)}
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
                    confirm={()=>{
                        const activations = FormData.layers[3].activations
                        const layer = {
                            type: 'activation',
                            msg: `Activation (${activations[aIndex]})`,
                            activation: activations[aIndex].toLowerCase()
                        }
                        dispatch({
                            type: 'ADD_LAYER',
                            layer: layer,
                            mode: false
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}

const DropoutForm = () => {
    const [ratio, setRatio] = useState(0.5)
    const { dispatch } = useContext(ContextStore)
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
                    confirm={()=>{
                        const layer = {
                            type: 'dropout',
                            msg: `Dropout (${ratio})`,
                            ratio: ratio
                        }
                        dispatch({
                            type: 'ADD_LAYER',
                            layer: layer,
                            mode: false
                        })
                    }}
                    />
            </Row>
        </SubFormContainer>
    )
}

