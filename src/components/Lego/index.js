import React, { Component } from 'react';
import styled from 'styled-components'

const LegoModule = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid gray;
  margin-bottom: 10px;
  cursor: pointer;
`


const Lego = (props) => {
    const text = props.text
    return (
        <LegoModule
            onClick={()=>{
                if ( text === '+' ) {
                    const newModuleInfo = {
                        type: 'conv2d',
                        msg: 'Conv2D (3x3) x 16'
                    }
                    props.createNewLego(newModuleInfo)
                }
            }}
        >
            {text}
        </LegoModule>
    )
}

export default Lego
