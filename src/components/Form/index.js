import React, { Component, useState } from 'react'
import styled from 'styled-components'

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

const ButtonsBox = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    margin-top: 5px;
    width: calc(100%);
    flex-direction: row;
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
            <Row label="Layer">
                {layerButtons}
            </Row>
            {
                (() => {
                    switch(layer) {
                        case 1:
                            return <ConvForm/>
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
                console.log('text: ', props.text)
                switch(props.type) {
                    case 'layer':
                        props.selectLayer()
                        break
                    case 'kernel':
                        props.selectKernelSize()
                        break
                }
            }}
        >
            {props.text}
        </ButtonLayout>
    )
}

const ConvFormContainer = styled.div`
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
            selected={ i === 0 ? true : false}
            text={e}
            />
    ))

    return (
        <ConvFormContainer>
            <Row label="Kernel size">
                {kernelButtons}
            </Row>
            <Row label="Filters">
                <Input value={filters} onChange={ e=>setFilters(e.target.value)}/>
            </Row>
            <Row label="Stride">
                W:<Input value={strideW} onChange={ e=>setStritedW(e.target.value)}/>
                H:<Input value={strideH} onChange={ e=>setStritedH(e.target.value)}/>
            </Row>
            <Row label="Padding">
                {paddingButtons}
            </Row>
            <Row reverse={true}>
                <Button
                    key={`confirm`} 
                    selected={ false}
                    text={'OK'}
                    />
            </Row>
        </ConvFormContainer>
    )
}