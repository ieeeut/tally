import React from 'react';
import { connect } from 'react-redux';
import Messages from '../Messages';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleOpenMeeting(event) {
    event.preventDefault();
  }

  render() {

    return (
      <div className="container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages}/>
            <form onSubmit={this.handleOpenMeeting.bind(this)} className="form-horizontal">
              <legend>Open Checkin</legend>
              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-8">
                  <button type="submit" className="btn btn-primary">Open Meeting</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="panel">
          <div className="panel-body">

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    user: state.auth.user,
    admin: state.admin
  };
};

export default connect(mapStateToProps)(Settings);
