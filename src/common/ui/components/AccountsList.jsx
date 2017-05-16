import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Divider, FloatingActionButton, FontIcon, List, ListItem, Paper, RaisedButton } from 'material-ui'

import AccountDialog from './AccountDialog'

import { fetchAccountsIfNeeded } from '../../actions'

const mapStateToProps = state => {
	return {
		accounts: state.accounts,
		isLoggedIn: state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchAccounts: () => {
			dispatch(fetchAccountsIfNeeded())
		}
	}
}

// Define the Accounts List component
class AccountsListComponent extends Component {
	constructor(props) {
		super(props)

		this.handleIsLoggedIn = (isLoggedIn) => {
			// If not logged in, navigate to the login page
			if (!isLoggedIn) {
				browserHistory.push('/login')
			}
		}
	}

	componentDidMount() {
		this.handleIsLoggedIn(this.props.isLoggedIn)

		// Fetch the accounts
		this.props.fetchAccounts()
	}

	componentWillReceiveProps(nextProps) {
		this.handleIsLoggedIn(nextProps.isLoggedIn)
	}

	render() {
		// Store a reference to the Account Dialog component
		// Used to show the dialog when the user clicks on an account
		let accountDialog

		return (
			<section className="room-table margin-bottom">
				{
					this.props.accounts.items.length > 0 ? (
						<Paper className="paper">
							<h1>Accounts</h1>
							<Divider />
							<List>
								{
									this.props.accounts.items.map((user) => (
										<ListItem primaryText={user.username} secondaryText={`Authentication Level: ${user.authLevel}`} onTouchTap={() => accountDialog.getWrappedInstance().show({ mode: 1, ...user })} key={user.userId} />
									))
								}
							</List>
						</Paper>
					) : (
						<Paper className="paper text-center">
							<h1>No accounts available!</h1>

							{
								// If logged in, display the 'Add New Account' button
								// Else, display a message to the user
								this.props.isLoggedIn ? (
									<RaisedButton label="Add New Account" secondary={true} onTouchTap={() => accountDialog.getWrappedInstance().show()} />
								) : (
									<p>If you're seeing this message, please contact the system administrator.</p>
								)
							}
						</Paper>
					)
				}

				{
					// If logged in, display the FAB for adding new accounts
					this.props.isLoggedIn && (
						<FloatingActionButton className="fab" secondary={true} onTouchTap={() => accountDialog.getWrappedInstance().show()}>
							<FontIcon className="material-icons">add</FontIcon>
						</FloatingActionButton>
					)
				}

				<AccountDialog ref={(dialog) => accountDialog = dialog} />
			</section>
		)
	}
}

// Define the property types that the component expects to receive
AccountsListComponent.propTypes = {
	accounts: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	fetchAccounts: PropTypes.func.isRequired
}

// Define the container for the Accounts List component (maps state and dispatchers)
const AccountsList = connect(mapStateToProps, mapDispatchToProps)(AccountsListComponent)

export default AccountsList
