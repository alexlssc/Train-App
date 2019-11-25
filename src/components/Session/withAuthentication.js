import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            this.props.onSetAuthUser(null);
        }
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    this.props.onSetAuthUser(authUser);
                },
                () => {
                    this.props.onSetAuthUser(null);
                },
            );
        }
        componentWillUnmount() {
            this.listener();
        }
        render() {
            return (
                <Component {...this.props} />
            );
        }
    }

    const mapDispatchToProps = dispatch => ({
        onSetAuthUser: authUser =>
            dispatch({ type: 'AUTH_USER_SET', authUser }),
    });

    return compose(
        withFirebase,
        connect(
            null,
            mapDispatchToProps,
        ),
    )(WithAuthentication);
};
export default withAuthentication;