import React from 'react';
import { connect } from 'react-redux'
import { updateProfile, changePassword, deleteAccount } from '../../actions/auth';
import Messages from '../Messages';
import swal from 'sweetalert';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.user.email,
      eid: props.user.eid,
      firstName: props.user.firstName || '',
      lastName: props.user.lastName || '',
      slackUsername: props.user.slackUsername || '',
      meetingPoints: props.user.meetingPoints || 0,
      admin: props.user.admin || false,
      password: '',
      confirm: ''
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleProfileUpdate(event) {
    event.preventDefault();
    this.props.dispatch(updateProfile(this.state, this.props.token));
  }

  handleChangePassword(event) {
    event.preventDefault();
    this.props.dispatch(changePassword(this.state.password, this.state.confirm, this.props.token));
  }

  handleDeleteAccount(event) {
    event.preventDefault();
    swal({
      title: "Are you sure you would like to delete your account?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Poof! Your account has been deleted!", {
          icon: "success",
        }).then(this.props.dispatch(deleteAccount(this.props.token)));
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages}/>
            <form onSubmit={this.handleProfileUpdate.bind(this)} className="form-horizontal">
              <legend>Profile Information</legend>
              <div className="form-group">
                <label htmlFor="email" className="col-sm-3">Email</label>
                <div className="col-sm-7">
                  <input type="email" name="email" id="email" className="form-control" value={this.state.email} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="eid" className="col-sm-3">EID</label>
                <div className="col-sm-7">
                  <input type="text" name="eid" id="eid" className="form-control" value={this.state.eid} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="firstName" className="col-sm-3">First Name</label>
                <div className="col-sm-7">
                  <input type="text" name="firstName" id="firstName" className="form-control" value={this.state.firstName} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="col-sm-3">Last Name</label>
                <div className="col-sm-7">
                  <input type="text" name="lastName" id="lastName" className="form-control" value={this.state.lastName} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="slackUsername" className="col-sm-3">Slack Username</label>
                <div className="col-sm-7">
                  <input type="text" name="slackUsername" id="slackUsername" className="form-control" value={this.state.slackUsername} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-4">
                  <button type="submit" className="btn btn-primary">Update Profile</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="panel">
          <div className="panel-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Points from Meetings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.admin.toString()}</td>
                  <td>{this.state.meetingPoints}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-body">
            <form onSubmit={this.handleChangePassword.bind(this)} className="form-horizontal">
              <legend>Change Password</legend>
              <div className="form-group">
                <label htmlFor="password" className="col-sm-3">New Password</label>
                <div className="col-sm-7">
                  <input type="password" name="password" id="password" className="form-control" value={this.state.password} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirm" className="col-sm-3">Confirm Password</label>
                <div className="col-sm-7">
                  <input type="password" name="confirm" id="confirm" className="form-control" value={this.state.confirm} onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-4 col-sm-offset-3">
                  <button type="submit" className="btn btn-primary">Change Password</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="panel">
          <div className="panel-body">
            <form onSubmit={this.handleDeleteAccount.bind(this)} className="form-horizontal">
              <legend>Delete Account</legend>
              <div className="form-group">
                <p className="col-sm-offset-3 col-sm-9">You can delete your account, but keep in mind this action is irreversible.</p>
                <div className="col-sm-offset-3 col-sm-9">
                  <button type="submit" className="btn btn-danger">Delete my account</button>
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
    token: state.auth.token,
    user: state.auth.user,
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Profile);
