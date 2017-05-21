import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import shortid from 'shortid'
import { Dialog, FlatButton, TextField, Toggle } from 'material-ui'

import { handleAddRoom, handleUpdateRoom, handleDeleteRoom } from '../../actions'

const mapStateToProps = state => {
	return {
		isLoggedIn: state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addRoom: (room) => {
			dispatch(handleAddRoom(room))
		},
		updateRoom: (room) => {
			dispatch(handleUpdateRoom(room))
		},
		deleteRoom: (roomId) => {
			dispatch(handleDeleteRoom(roomId))
		}
	}
}

// Define the available modes for the Room Dialog Component
const MODE_ADD = 0
const MODE_VIEW = 1
const MODE_EDIT = 2

// Define the Room Dialog component
class RoomDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			mode: MODE_ADD,
			dialogTitle: 'New Room',
			roomId: '',
			roomName: '',
			roomNameErrorText: '',
			roomDesc: '',
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
				this.setState({ dialogTitle: 'View Room' })
				break
			case MODE_EDIT:
				this.setState({ dialogTitle: 'Edit Room' })
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
		this.props.deleteRoom(this.state.roomId)
		this.dismiss()
	}

	edit() {
		this.oldState = this.state
		this.setState({
			dialogTitle: 'Edit Room',
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
			roomNameErrorText: ''
		})

		// If in 'View' mode, skip validation
		if (this.state.mode === MODE_VIEW) {
			return this.dismiss()
		}

		let hasError = false

		if (this.state.roomName === '') {
			this.setState({ roomNameErrorText: 'This field is required' })
			hasError = true
		}

		if (!hasError) {
			const room = {
				roomId: this.state.roomId,
				roomName: this.state.roomName,
				roomDesc: this.state.roomDesc,
				isAvailable: this.state.isAvailable
			}

			if (this.state.mode === MODE_EDIT) {
				this.props.updateRoom(room)
			} else if (this.state.mode === MODE_ADD) {
				room.roomId = shortid.generate() + moment().format('ss')
				this.props.addRoom(room)
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
				<TextField id="name" className="form-input" floatingLabelText="Name" floatingLabelFixed={true} errorText={this.state.roomNameErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'roomName')} value={this.state.roomName} /><br />
				<TextField id="description" className="form-input" floatingLabelText="Description" floatingLabelFixed={true} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'roomDesc')} value={this.state.roomDesc} /><br />
				<Toggle label="Available for Booking" labelPosition="right" defaultToggled={this.state.isAvailable} disabled={this.state.mode === MODE_VIEW} onToggle={(event, isInputChecked) => this.handleChange(isInputChecked, 'isAvailable')} value={this.state.isAvailable} />
				{
					(() => {
						if (this.props.isLoggedIn && this.state.mode !== MODE_ADD) {
							const userCreated = this.props.accounts.items.find(user => user.userId === this.state.createdBy)
							const userUpdated = this.props.accounts.items.find(user => user.userId === this.state.updatedBy)

							return (
								<div className="form-label">
									{
										userCreated.username && this.state.createdDate && (
											<p>Created by {userCreated.username} on {this.state.createdDate}</p>
										)
									}
									{
										userUpdated.username && this.state.updatedDate && (
											<p>Updated by {userUpdated.username} on {this.state.updatedDate}</p>
										)
									}
								</div>
							)
						}
					})()
				}
			</Dialog>
		)
	}
}

// Define the property types that the component expects to receive
RoomDialogComponent.propTypes = {
	accounts: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	addRoom: PropTypes.func.isRequired,
	updateRoom: PropTypes.func.isRequired,
	deleteRoom: PropTypes.func.isRequired,
	fetchAccounts: PropTypes.func.isRequired
}

// Define the container for the Room Dialog component (maps state and dispatchers)
const RoomDialog = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(RoomDialogComponent)

export default RoomDialog
