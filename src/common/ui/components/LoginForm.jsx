import React from 'react'
import { Paper, TextField, RaisedButton } from 'material-ui'

// Define the Login Form component
const LoginForm = () => (
	<section>
		<div className="row center-xs">
			<Paper className="paper">
				<form action="/api/login" method="post">
					<TextField id="username" className="form-input" floatingLabelText="Username" floatingLabelFixed={true} /><br />
					<TextField id="password" className="form-input" floatingLabelText="Password" floatingLabelFixed={true} type="password" /><br />

					<RaisedButton label="Log In" type="submit" secondary={true} />
				</form>
			</Paper>
		</div>
	</section>
)

export default LoginForm
