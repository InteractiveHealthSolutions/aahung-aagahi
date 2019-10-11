import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import { Label } from 'reactstrap';
import openIconic from "../img/open-iconic.svg";
import smileyHappy from "../img/smiley-happy.svg";
import smileyHappySelected from "../img/smiley-happy-selected.svg";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: purple;
`;
 
class AgreeCheckBox extends React.Component {
  constructor(props) {
    super(props);
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.state = {
      id: this.props.id,
      value: this.props.value,
      name: this.props.name,
      labelText: this.props.labelText
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  

    this.state = {
        id: nextProps.id,
        value: nextProps.value,
        name: nextProps.name,
        labelText: nextProps.labelText
    }
  }

  render() {

    return (

      <div style={{width:'8em'}}>
      <div class="pretty p-svg p-toggle p-plain p-bigger p-round" style={{fontSize: '1.5em', paddingRight:'2em', marginLeft: '18%'}}>
          <input type="radio" id={this.state.id} value={this.state.value} name={this.state.name} defaultChecked= { false} onChange={this.props.handleCheckboxChange}/>
          <div class="state p-off" >
          {/* <svg class="svg" viewBox="0 0 8 8" style={{fill: "rgb(247, 144, 29)"}}><use xlinkHref={`${openIconic}#lock-unlocked`} class="icon-lock-unlocked"></use></svg> */}
          <img class="svg" src={smileyHappy}/>
          </div>
          <div class="state p-on" >
          {/* <svg class="svg" viewBox="0 0 8 8" style={{fill: "grey"}}><use xlinkHref={`${openIconic}#lock-locked`} class="icon-lock-locked"></use></svg> */}
          <img class="svg" src={smileyHappySelected}/>
              
          </div>
      </div>
      <div style={{width: '5em', textAlign: 'center'}}>
          <label>{this.state.labelText}</label>
          </div>
      </div>

      // this component will be accessed in other components as below
      // <AgreeCheckBox id="xyz" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>

    // <Row>
    //     <Col md="12" >
    //         <div style={{display: 'flex', flexWrap: 'wrap'}}>
    //             <StronglyAgreeCheckBox id="agree" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    //             <AgreeCheckBox id="agree" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    //             <NeutralCheckbox id="agree" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    //             <DisagreeCheckBox id="agree" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    //             <StronglyDisagreeCheckBox id="disagree" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    //         </div>
    //     </Col>
    // </Row>
    )
  }
}

export default AgreeCheckBox;