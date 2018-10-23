import React from 'react';
import './Signup.scss';

const Signup = ({
	handleSubmit,
	loading,
	updateEmail,
	updatePassword,
	updateRetypePassword,
	updateRole,
	role,
	success
}) => (
	<form onSubmit={ handleSubmit }>
		<h3>Sign up</h3>

		<p className = "text-danger">

		</p>
		<input
			placeholder="Email"
			className="form-control"
			onChange={ updateEmail }
		/>
		
		<input
			type="password"
			placeholder="Password"
			className="form-control"
			onChange={ updatePassword }
		/>

		<p className = "text-danger">
			
		</p>
		<input
			type="password"
			placeholder="Retype password"
			className="form-control"
			onChange={ updateRetypePassword }
		/>

		<input
			placeholder="Name"
			className="form-control"
			onChange={ updateEmail }
		/>

		

		<div>

			<span>
				<label>
					Role
				</label>
				<select defaultValue = { role }>
					<option value="1">User</option>
					<option value="2">Employer</option>
					<option value="3">Issuer</option>
				</select>
			</span>
		</div>

		<button className="btn btn-primary">
			{ loading ? 'Loading...' : 'Sign up'}
		</button>
	</form>
);

export default Signup;
