import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import { Label } from 'reactstrap';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: purple;
`;
 
class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading
    }
  }
  render() {
    return (
      <div className='sweet-loading'>
        <GridLoader
          css={override}
          sizeUnit={"px"}
          size={25}
          color={'#8e24aa'}
          loading={this.state.loading}
          
        />
        
        <Label style={{color: "#ef6c00", display: "inline-block", width: "100%", textAlign: "center"}}><h7><b>Saving trees...</b></h7></Label>
      </div> 
    )
  }
}

export default LoadingIndicator;