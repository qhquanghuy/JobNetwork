import autodux from 'autodux';

export const { actions, initial, reducer } = autodux({
	slice: 'signup',
	initial: {
		email: '',
		password: '',
		loading: false,
		success: false,
	},
	actions: {
		sendSignupInfo: (state, { email, password }) => ({
			email,
			password,
			loading: true
		}),
		signupSuccess: (state, res) => {
			return ({
				...state,
				success: true,
			})
		}
	}
});
