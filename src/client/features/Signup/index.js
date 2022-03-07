import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { prop } from 'ramda';
import getTargetValue from '../../helpers/getTargetValue';
import SignupComponent from './Signup.component';
import { actions } from './Signup.duck';

import { withRouter } from 'react-router-dom'


const Signup = ({
	handleSubmit,
	loading,
	updateEmail,
	updatePassword,
	updateReytypePassword,
	role
}) => (
	<SignupComponent
		handleSubmit={ handleSubmit }
		loading={ loading }
		updateEmail={ updateEmail }
		updatePassword={ updatePassword }
		updateReytypePassword={ updateReytypePassword }
		role = { role }
	/>
);

const enhanceComponent = compose(
	withRouter,
	connect(prop('signupReducer'), actions),
	withHandlers({
		handleSubmit: ({
			email,
			password,
			sendSignupInfo
		}) => (event) => {
			event.preventDefault();

			sendSignupInfo({ email, password });
		},
		updateEmail: ({ setEmail }) => compose(
			setEmail,
			getTargetValue
		),
		updatePassword: ({ setPassword }) => compose(
			setPassword,
			getTargetValue
		),
		updateRetypePassword: ({ setRetypePassword }) => compose(
			setRetypePassword,
			getTargetValue
		)
	})
);

export default enhanceComponent(Signup);
