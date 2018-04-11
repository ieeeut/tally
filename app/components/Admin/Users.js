import React from 'react';
import { connect } from 'react-redux'
import Messages from '../Messages';
import { getUsers } from '../../actions/admin';
import ReactTable from 'react-table';

class Users extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userList: props.userList || [],
      eid: props.user.eid || '',
      firstName: props.user.firstName || '',
      lastName: props.user.lastName || '',
      slackUsername: props.user.slackUsername || '',
      meetingPoints: props.user.meetingPoints || 0,
      admin: props.user.admin || false,
    };
  }

  componentDidMount() {
    this.props.dispatch(getUsers());
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const columns = [{
      Header: 'eid',
      accessor: 'eid'
    }, {
      Header: 'firstName',
      accessor: 'firstName'
    }, {
      Header: 'lastName',
      accessor: 'lastName'
    }, {
      Header: 'email',
      accessor: 'email'
    }, {
      Header: 'meetingPoints',
      accessor: 'meetingPoints'
    }, {
      Header: 'slackUsername',
      accessor: 'slackUsername'
    }]

    const toRender = (this.props.userList.length > 0) ? (
      <ReactTable
        data={this.props.userList}
        columns={columns}
        showPageSizeOptions={false}
        defaultPageSize={10}
        className="-striped -highlight"
      />
    ) : (
      <ReactTable
        loading={true}
        data={this.props.userList}
        columns={columns}
        showPageSizeOptions={false}
        defaultPageSize={10}
        className="-striped -highlight"
      />
    )

    return (
      <div className="container-fluid">
        <Messages messages={this.props.messages}/>
        <div className="row">
          <div className="col-md-12">
            {toRender}
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
    userList: state.admin.userList
  };
};

export default connect(mapStateToProps)(Users);
