import React from 'react';
import { connect } from 'react-redux';
import Messages from '../Messages';
import { updateSettings, getSettings, openCheckin, closeCheckin } from '../../actions/admin';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meetingPoints: props.admin.settings.meetingPoints || 0,
      socialPoints: props.admin.settings.socialPoints || 0,
      meetingOpen: props.admin.settings.openMeeting || 0,
      socialOpen: props.admin.settings.openSocial || 0
    };
  }

  componentDidMount() {
    this.props.dispatch(getSettings()).then(() => {
      this.setState({
        meetingPoints: this.props.admin.settings.meetingPoints,
        socialPoints: this.props.admin.settings.socialPoints,
        meetingOpen: this.props.admin.settings.meetingOpen ,
        socialOpen: this.props.admin.settings.socialOpen
      })
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleOpenMeeting(event) {
    event.preventDefault();
    this.props.dispatch(openCheckin("meeting", this.props.user.token)).then(() => {
      this.setState({
        meetingOpen: this.props.admin.settings.meetingOpen ,
        socialOpen: this.props.admin.settings.socialOpen
      })
    });
  }

  handleOpenSocial(event) {
    event.preventDefault();
    this.props.dispatch(openCheckin("social", this.props.user.token)).then(() => {
      this.setState({
        meetingOpen: this.props.admin.settings.meetingOpen ,
        socialOpen: this.props.admin.settings.socialOpen
      })
    });
  }

  handleCloseCheckin(event) {
    event.preventDefault();
    this.props.dispatch(closeCheckin(this.props.user.token)).then(() => {
      this.setState({
        meetingOpen: this.props.admin.settings.meetingOpen,
        socialOpen: this.props.admin.settings.socialOpen
      })
    });
  }

  handleUpdateSettings(event) {
    event.preventDefault();
    this.props.dispatch(updateSettings(this.state.meetingPoints, this.state.socialPoints, this.props.token));
  }

  render() {
    var toRender;
    if (this.state.socialOpen || this.state.meetingOpen) {
      toRender = (
        <div className="panel-body">
          <Messages messages={this.props.messages}/>
          <legend>Close Checkin System</legend>
          <form onSubmit={this.handleCloseCheckin.bind(this)} className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <button type="submit" className="btn btn-danger">Close Checkin</button>
              </div>
            </div>
          </form>
        </div>
      )
    } else {
      toRender = (
        <div className="panel-body">
          <Messages messages={this.props.messages}/>
          <legend>Open Checkin System</legend>
          <form onSubmit={this.handleOpenMeeting.bind(this)} className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-8">
                <button type="submit" className="btn btn-primary">Open Meeting</button>
              </div>
            </div>
          </form>
          <form onSubmit={this.handleOpenSocial.bind(this)} className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-8">
                <button type="submit" className="btn btn-primary">Open Social</button>
              </div>
            </div>
          </form>
        </div>
      )
    }
    return (
      <div className="container">
        <div className="panel">
          {toRender}
        </div>
        <div className="panel">
          <div className="panel-body">
            <form onSubmit={this.handleUpdateSettings.bind(this)} className="form-horizontal">
              <legend>Change Point Values</legend>
              <div className="form-group">
                <label htmlFor="password" className="col-sm-3">Meetings</label>
                <div className="col-sm-7">
                  <input type="text" name="meetingPoints" id="meetingPoints" className="form-control" value={this.state.meetingPoints} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirm" className="col-sm-3">Socials</label>
                <div className="col-sm-7">
                  <input type="text" name="socialPoints" id="socialPoints" className="form-control" value={this.state.socialPoints} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-4 col-sm-offset-3">
                  <button type="submit" className="btn btn-primary">Update</button>
                </div>
              </div>
            </form>
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
