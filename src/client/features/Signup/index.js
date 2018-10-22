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
	success,
	id
}) => (
	<SignupComponent
		handleSubmit={ handleSubmit }
		loading={ loading }
		updateEmail={ updateEmail }
		updatePassword={ updatePassword }
		success={ success }
		id={ id }
	/>
);

const enhanceComponent = compose(
	withRouter,
	connect(prop('signupReducer'), actions),
	withHandlers({
		handleSubmit: ({
			username,
			password,
			sendSignupInfo
		}) => (event) => {
			event.preventDefault();

			sendSignupInfo({ username, password });
		},
		updateEmail: ({ setEmail }) => compose(
			setEmail,
			getTargetValue
		),
		updatePassword: ({ setPassword }) => compose(
			setPassword,
			getTargetValue
		)
	})
);

export default enhanceComponent(Signup);
