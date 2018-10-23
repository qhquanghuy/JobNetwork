import autodux from 'autodux';

export const { actions, initial, reducer } = autodux({
	slice: 'signup',
	initial: {
		email: '',
		password: '',
		retypePassword: '',
		role: 1,
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
