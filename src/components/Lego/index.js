import React, { Component } from 'react'
import styled from 'styled-components'
import CloseIcon from '../../icons/close.png'

const LegoModule = styled.div`
  display: inline-flex;
  position: relative;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid gray;
  margin-bottom: 10px;
  cursor: pointer;
`
const RemoveIcon = styled.img`
    position: absolute;
    right: -5px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid gray;
    background-color: white;
`


const Lego = (props) => {
    return (
        <LegoModule
            onClick={()=>{
                if ( props.text === '+' ) {
                    props.dispatch({
                        type: 'CREATE_MODE',
                        mode: true
                    })
                }
            }}
        >
            {props.text !== '+' && props.type !== 'input' && (
                <RemoveIcon 
                    src={CloseIcon}
                    onClick={()=>props.dispatch({type: 'REMOVE_LAYER', index: props.index})}
                    />
                )
            }
            {props.text}
        </LegoModule>
    )
}

export default Lego
