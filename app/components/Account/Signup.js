import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { signup } from '../../actions/auth';
import Messages from '../Messages';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      slackUsername: '',
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(signup(this.state.eid, this.state.email, this.state.password, this.state.firstName, this.state.lastName, this.state.slackUsername));
  }

  render() {
    return (
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages}/>
            <form onSubmit={this.handleSignup.bind(this)}>
              <legend>Create an account</legend>
              <div className="form-group">
                <label htmlFor="eid">EID</label>
                <input type="text" name="eid" id="eid" placeholder="EID" autoFocus className="form-control" value={this.state.eid} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" className="form-control" value={this.state.email} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Password" className="form-control" value={this.state.password} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="firstName">First Name (optional)</label>
                <input type="text" name="firstName" id="firstName" placeholder="First Name" className="form-control" value={this.state.firstName} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name (optional)</label>
                <input type="text" name="lastName" id="lastName" placeholder="Last Name" className="form-control" value={this.state.lastName} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="slackUsername">Slack Username (optional)</label>
                <input type="text" name="slackUsername" id="slackUsername" placeholder="Slack Username" className="form-control" value={this.state.slackUsername} onChange={this.handleChange.bind(this)}/>
              </div>
              <button type="submit" className="btn btn-primary">Create an account</button>
            </form>
          </div>
        </div>
        <p className="text-center">
          Already have an account? <Link to="/login"><strong>Log in</strong></Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Signup);
