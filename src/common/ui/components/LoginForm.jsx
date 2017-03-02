import React from 'react'
import { Paper, TextField, RaisedButton } from 'material-ui'

const LoginForm = () => (
	<Paper className="form">
		<form action="/api/login" method="post">
			<TextField id="username" className="form-input" floatingLabelText="Username" floatingLabelFixed={true} /><br />
			<TextField id="password" className="form-input" floatingLabelText="Password" floatingLabelFixed={true} /><br />

			<RaisedButton label="Log In" />
		</form>
	</Paper>
)

export default LoginForm
