import React from 'react';
import './Topics.css';


function HoritzontalCard(props) {

  return (
    <>
          <div onClick={props.onClick}class="topic-card">
        <div className="topic-card-image-view">
            <img src={props.imageSource}></img>
        </div>
        <div className="topic-card-content-view">
            <h5 class="card-title">{props.title}</h5>
            <p class="card-text">{props.description}</p>
            <p class="card-text"><small class="text-muted">{props.subtext}</small></p>
          
        </div>

      </div>

    </>

  );
}


export default HoritzontalCard;
