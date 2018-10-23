import { ofType } from 'redux-observable';
import { tap, catchError, delay, map, pluck, mergeMap } from 'rxjs/operators';
import { actions } from './Signup.duck';

const { sendSignupInfo, signupSuccess } = actions;
const url = 'http://localhost:8080/api/user/signin';
const header = { 'Content-Type': 'application/json; charset=utf-8' };

export const sendSignupInfoEpic = (action$, store, { fetch$ }) => action$.pipe(
	ofType(sendSignupInfo.type),

	mergeMap(({ payload }) => 
		fetch$
			.post(url, { email: payload.email, password: payload.password }, header)
			.pipe(
				pluck('response'),
				catchError((err) => console.log(err))
			)
	),
	map(signupSuccess)
);
