import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import { Label } from 'reactstrap';
import openIconic from "../img/open-iconic.svg";
import smileyNeutral from "../img/smiley-neutral.svg";
import smileyNeutralSelected from "../img/smiley-neutral-selected.svg";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: purple;
`;
 
class NeutralCheckBox extends React.Component {
  constructor(props) {
    super(props);
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.state = {
      id: this.props.id,
      value: this.props.value,
      name: this.props.name
      // msg: this.props.msg
    }
  
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  

    this.state = {
        id: nextProps.id,
      value: nextProps.value,
      name: nextProps.name
    }
  }

  render() {

    return (

    <div style={{paddingRight:'1.5em'}}>
    <div class="pretty p-svg p-toggle p-plain p-bigger p-round" style={{fontSize: '1.5em', paddingRight:'0.5em'}}>
        <input type="radio" id={this.state.id} value={this.state.value} name={this.state.name} defaultChecked= { false} onChange={this.props.handleCheckboxChange}/>
        <div class="state p-off" >
        {/* <svg class="svg" viewBox="0 0 8 8" style={{fill: "rgb(247, 144, 29)"}}><use xlinkHref={`${openIconic}#lock-unlocked`} class="icon-lock-unlocked"></use></svg> */}
        <img class="svg" style={{fill: "#65bbd2"}} src={smileyNeutral}/>
            {/* <label >Neither Agree nor Disagree</label> */}
        </div>
        <div class="state p-on" >
        {/* <svg class="svg" viewBox="0 0 8 8" style={{fill: "grey"}}><use xlinkHref={`${openIconic}#lock-locked`} class="icon-lock-locked"></use></svg> */}
        <img class="svg" style={{fill: "#65bbd2"}} src={smileyNeutralSelected}/>
            
        </div>
    </div>
    <label >Neither Agree nor Disagree</label>
    </div>

    // this component will be accessed in other components as below
    // <NeutralCheckBox id="xyz" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    )
  }
}

export default NeutralCheckBox;