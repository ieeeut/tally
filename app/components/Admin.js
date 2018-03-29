import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import {} from '../actions/admin';

class Admin extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className="container-fluid">
        <Messages messages={this.props.messages}/>
        <div className="row">
          <div className="col-sm-4">
            <div className="panel">
              <div className="panel-body">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Admin);
