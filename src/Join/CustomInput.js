import React from 'react';

import './CustomInput.css';


function CustomInput(props) {
    
  return (
        <div class="input-view">
            <p class="input-title">{props.title}</p>
            <input type="text" 
            value={props.value} 
            onChange={(event)=> props.onChange(event) } 
            class="input-user-input" 
            placeholder={props.placeholder}></input>
        </div>

  );
}

export default CustomInput;
