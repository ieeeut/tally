import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import { checkin } from '../actions/home';
import { getUsers } from '../actions/admin';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = { eid: ''};
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckin(event) {
    event.preventDefault();
    this.props.dispatch(checkin(this.state.eid));
  }

  render() {
    return (
      <div className="container-fluid">
        <Messages messages={this.props.messages}/>
        <div className="row">
          <div className="col-sm-4 col-sm-offset-4">
            <div className="panel">
              <div className="panel-body">
                <form onSubmit={this.handleCheckin.bind(this)}>
                  <legend>Check In</legend>
                  <div className="form-group">
                    <label htmlFor="eid">EID</label>
                    <input type="text" name="eid" id="eid" placeholder="EID" autoFocus className="form-control" value={this.state.eid} onChange={this.handleChange.bind(this)}/>
                  </div>
                  <button type="submit" className="btn btn-success">Submit</button>
                </form>
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
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Home);
