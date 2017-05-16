import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import shortid from 'shortid'
import { Dialog, FlatButton, TextField } from 'material-ui'

import { handleAddAccount, handleUpdateAccount, handleDeleteAccount } from '../../actions'

const mapStateToProps = state => {
	return {
		isLoggedIn: state.user.isLoggedIn,
		authLevel: state.user.authLevel,
		accounts: state.accounts
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addAccount: (user) => {
			dispatch(handleAddAccount(user))
		},
		updateAccount: (user) => {
			dispatch(handleUpdateAccount(user))
		},
		deleteAccount: (userId) => {
			dispatch(handleDeleteAccount(userId))
		}
	}
}

// Define the available modes for the Account Dialog Component
const MODE_ADD = 0
const MODE_VIEW = 1
const MODE_EDIT = 2

// Define the Account Dialog component
class AccountDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			mode: MODE_ADD,
			dialogTitle: 'New Account',
			userId: '',
			username: '',
			usernameErrorText: '',
			password: '',
			passwordErrorText: '',
			confirmPassword: '',
			confirmPasswordErrorText: '',
			authLevel: '1',
			authLevelErrorText: '',
			isAvailable: true
		}
	}

	handleChange(value, stateName) {
		this.setState({
			[stateName]: value,
			[stateName + 'ErrorText']: ''
		})
	}

	show(props) {
		this.setState({
			...props,
			open: true
		})

		if (props) {
			switch (props.mode) {
			case MODE_VIEW:
				this.setState({ dialogTitle: 'View Account' })
				break
			case MODE_EDIT:
				this.setState({ dialogTitle: 'Edit Account' })
				break
			case MODE_ADD:
			default:
				this.setState({ dialogTitle: this.defaultState.dialogTitle })
				break
			}
		}
	}

	dismiss() {
		this.setState(this.defaultState)
	}

	delete() {
		this.props.deleteAccount(this.state.userId)
		this.dismiss()
	}

	edit() {
		this.oldState = this.state
		this.setState({
			dialogTitle: 'Edit Account',
			mode: MODE_EDIT
		})
	}

	cancel() {
		if (this.state.mode === MODE_EDIT) {
			this.setState(this.oldState)
		} else {
			this.dismiss()
		}
	}

	accept() {
		// Reset all error text
		this.setState({
			usernameErrorText: '',
			passwordErrorText: '',
			confirmPasswordErrorText: '',
			authLevelErrorText: ''
		})

		// If in 'View' mode, skip validation
		if (this.state.mode === MODE_VIEW) {
			return this.dismiss()
		}

		let hasError = false

		if (this.state.username === '') {
			this.setState({ usernameErrorText: 'This field is required' })
			hasError = true
		}

		if (this.state.mode === MODE_ADD || (this.state.mode === MODE_EDIT && this.state.username !== this.oldState.username)) {
			if (this.props.accounts.items.some((user) => user.username === this.state.username)) {
				this.setState({ usernameErrorText: 'Username already exists' })
				hasError = true
			}
		}

		if (this.state.password === '') {
			this.setState({ passwordErrorText: 'This field is required' })
			hasError = true
		}

		if (this.state.confirmPassword === '') {
			this.setState({ confirmPasswordErrorText: 'This field is required' })
			hasError = true
		}

		if (this.state.confirmPassword !== this.state.password) {
			this.setState({ confirmPasswordErrorText: 'Passwords must match' })
			hasError = true
		}

		if (this.state.authLevel === '') {
			this.setState({ authLevelErrorText: 'Enter a number between 1 and 100' })
			hasError = true
		} else {
			let authLevel = parseInt(this.state.authLevel)

			if (typeof(authLevel) !== 'number') {
				this.setState({ authLevelErrorText: 'Enter a number between 1 and 100' })
				hasError = true
			} else {
				if (authLevel > this.props.authLevel) {
					this.setState({ authLevelErrorText: `Cannot exceed your Authentication Level (${this.props.authLevel})` })
					hasError = true
				}

				if (authLevel < 1 || authLevel > 100) {
					this.setState({ authLevelErrorText: 'Authentication Level must be between 1 and 100' })
					hasError = true
				}
			}
		}

		if (!hasError) {
			const user = {
				userId: this.state.userId,
				username: this.state.username,
				password: this.state.password,
				authLevel: Math.floor(parseInt(this.state.authLevel))
			}

			if (this.state.mode === MODE_EDIT) {
				this.props.updateAccount(user)
			} else if (this.state.mode === MODE_ADD) {
				user.userId = shortid.generate() + moment().format('ss')
				this.props.addAccount(user)
			}

			this.dismiss()
		}
	}

	render() {
		// Define the action buttons to display in the dialog
		const actions = [ <FlatButton label="Ok" secondary={true} onTouchTap={() => this.accept()} /> ]

		if (this.props.isLoggedIn) {
			if (this.state.mode === MODE_ADD || this.state.mode === MODE_EDIT) {
				actions.unshift(<FlatButton label="Cancel" secondary={true} onTouchTap={() => this.cancel()} />)

				if (this.state.mode === MODE_EDIT) {
					actions.unshift(<FlatButton label="Delete" secondary={true} onTouchTap={() => this.delete()} />)
				}
			} else if (this.state.mode === MODE_VIEW) {
				actions.unshift(<FlatButton label="Edit" secondary={true} onTouchTap={() => this.edit()} />)
			}
		}

		return (
			<Dialog contentClassName="dialog" title={this.state.dialogTitle} autoScrollBodyContent={true} actions={actions} open={this.state.open} onRequestClose={() => this.dismiss()}>
				<form noValidate>
					<TextField id="username" className="form-input" floatingLabelText="Username" floatingLabelFixed={true} errorText={this.state.usernameErrorText} disabled={this.state.mode === MODE_VIEW || this.state.mod === MODE_EDIT} onChange={(event) => this.handleChange(event.target.value, 'username')} value={this.state.username} /><br />
					<TextField id="password" className="form-input" floatingLabelText="Password" floatingLabelFixed={true} errorText={this.state.passwordErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'password')} value={this.state.password} type="password" /><br />
					<TextField id="confirmPassword" className="form-input" floatingLabelText="Confirm Password" floatingLabelFixed={true} errorText={this.state.confirmPasswordErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'confirmPassword')} value={this.state.confirmPassword} type="password" /><br />
					<TextField id="authLevel" className="form-input" floatingLabelText="Authentication Level" floatingLabelFixed={true} errorText={this.state.authLevelErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'authLevel')} value={this.state.authLevel} type="number" />
				</form>
			</Dialog>
		)
	}
}

// Define the property types that the component expects to receive
AccountDialogComponent.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	authLevel: PropTypes.number.isRequired,
	accounts: PropTypes.object.isRequired,
	addAccount: PropTypes.func.isRequired,
	updateAccount: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired
}

// Define the container for the Account Dialog component (maps state and dispatchers)
const AccountDialog = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AccountDialogComponent)

export default AccountDialog
