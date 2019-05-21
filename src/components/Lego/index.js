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
            {props.text}
        </LegoModule>
    )
}

export default Lego
