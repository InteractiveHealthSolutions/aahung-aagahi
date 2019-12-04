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
      loading: this.props.loading,
      msg: this.props.msg
    }
  
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  

    this.state = {
      loading: nextProps.loading,
      msg: nextProps.msg
    }
  }

  render() {

    // tertiary within tertiary
    const text = this.state.loading ? (( this.state.msg !== undefined && this.state.msg !== '') ? this.state.msg : 'Saving trees...' ): '' ;

    return (
      <div className='sweet-loading'>
        <GridLoader
          css={override}
          sizeUnit={"px"}
          size={8}
          color={'#00C851'}
          loading={this.state.loading}
        />
        <Label style={{color: "#212529", display: "inline-block", width: "100%", textAlign: "center"}}><h8><b>{text}</b></h8></Label>
      </div> 
    )
  }
}

export default LoadingIndicator;