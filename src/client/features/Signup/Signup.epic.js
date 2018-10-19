import { ofType } from 'redux-observable';
import { tap, catchError, delay, map, pluck, mergeMap } from 'rxjs/operators';
import { actions } from './Signup.duck';

const { sendSignupInfo, signupSuccess } = actions;
const url = 'http://localhost:8080/api/users';

export const sendSignupInfoEpic = (action$, store, { fetch$ }) => action$.pipe(
	ofType(sendSignupInfo.type),

	mergeMap(({ payload }) => 
		fetch$
			.post(url, {username: payload.username})
			.pipe(
				pluck('response')
			)
	),
	tap(val => console.log("33333",val)),
	// .pipe(
	// 	pluck('response'),
	// 	pluck('id'),
	// 	catchError((error) => console.error('Problem!', error.message))
	// )
	map(signupSuccess)
);
