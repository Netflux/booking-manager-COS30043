import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { CircularProgress, FontIcon, Paper, RaisedButton, TextField } from 'material-ui'
import { red500 } from 'material-ui/styles/colors'

import { requestLogin } from '../../actions'

const mapStateToProps = state => {
	return {
		isLoggingIn: state.user.isLoggingIn,
		isLoggedIn: state.user.isLoggedIn,
		loginError: state.user.loginError
	}
}

const mapDispatchToProps = dispatch => {
	return {
		handleLogin: (username, password) => {
			dispatch(requestLogin(username, password))
		}
	}
}

// Define the Login Form component
class LoginFormComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = {
			username: '',
			usernameErrorText: '',
			password: '',
			passwordErrorText: ''
		}

		this.handleIsLoggedIn = (isLoggedIn) => {
			// If already logged in, navigate to the homepage
			if (isLoggedIn) {
				browserHistory.push('/')
			}
		}
	}

	componentDidMount() {
		this.handleIsLoggedIn(this.props.isLoggedIn)
	}

	componentWillReceiveProps(nextProps) {
		this.handleIsLoggedIn(nextProps.isLoggedIn)
	}

	handleChange(value, stateName) {
		this.setState({
			[stateName]: value,
			[stateName + 'ErrorText']: ''
		})
	}

	onLogin(event) {
		// Prevent the default form submit action
		event.preventDefault()

		if (!this.props.isLoggingIn) {
			let hasError = false

			if (this.state.username === '') {
				this.setState({ usernameErrorText: 'This field is required' })
				hasError = true
			}

			if (this.state.password === '') {
				this.setState({ passwordErrorText: 'This field is required' })
				hasError = true
			}

			if (!hasError) {
				this.props.handleLogin(this.state.username, this.state.password)
			}
		}
	}

	render() {
		return (
			<section>
				<div className="row center-xs">
					<Paper className="paper">
						<h1 className="header text-center">Login</h1>
						<form action="/login" method="post" onSubmit={(event) => this.onLogin(event)}>
							{
								// If there is a login error, display it
								this.props.loginError && (
									<div className="login-error">
										<FontIcon className="material-icons" color={red500}>error</FontIcon>
										<p>{this.props.loginError}</p>
									</div>
								)
							}

							<TextField id="username" className="form-input" name="username" floatingLabelText="Username" floatingLabelFixed={true} errorText={this.state.usernameErrorText} onChange={(event) => this.handleChange(event.target.value, 'username')} value={this.state.username} /><br />
							<TextField id="password" className="form-input" name="password" floatingLabelText="Password" floatingLabelFixed={true} errorText={this.state.passwordErrorText} onChange={(event) => this.handleChange(event.target.value, 'password')} value={this.state.password} type="password" /><br />

							{
								// If logging in, display the circular progress bar
								// Else, display the login button
								this.props.isLoggingIn ? (
									<CircularProgress color="#FF9800" />
								) : (
									<RaisedButton label="Log In" secondary={true} disabled={this.props.isLoggingIn} type="submit" />
								)
							}
						</form>
					</Paper>
				</div>
			</section>
		)
	}
}

// Define the property types that the component expects to receive
LoginFormComponent.propTypes = {
	isLoggingIn: PropTypes.bool.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	loginError: PropTypes.string.isRequired,
	handleLogin: PropTypes.func.isRequired
}

// Define the container for the Login Form component (maps state and dispatchers)
const LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginFormComponent)

export default LoginForm
