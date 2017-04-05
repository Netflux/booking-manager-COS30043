import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import shortid from 'shortid'
import { Dialog, FlatButton, MenuItem, SelectField, Snackbar, TextField, Toggle } from 'material-ui'

import { handleAddRoom, handleUpdateRoom, handleDeleteRoom } from '../../actions'

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

// Define the Room Dialog component
class RoomDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			editing: false,
			dialogTitle: "New Room",
			roomId: "",
			roomName: "",
			roomNameErrorText: "",
			roomDesc: "",
			isAvailable: true
		}
	}

	handleChange(value, stateName) {
		this.setState({
			[stateName]: value,
			[stateName + "ErrorText"]: ""
		})
	}

	show(props) {
		this.setState({
			...props,
			open: true
		})
	}

	dismiss() {
		this.setState(this.defaultState)
	}

	delete() {
		this.props.deleteRoom(this.state.roomId)
		this.dismiss()
	}

	accept() {
		let hasError = false

		if (this.state.roomName == "") {
			this.setState({roomNameErrorText: "This field is required"})
			hasError = true
		}

		if (!hasError) {
			let room = {
				roomId: this.state.roomId,
				roomName: this.state.roomName,
				roomDesc: this.state.roomDesc,
				isAvailable: this.state.isAvailable
			}

			if (this.state.editing) {
				this.props.updateRoom(room)
			} else {
				room.roomId = shortid.generate() + moment().format('ss')
				this.props.addRoom(room)
			}

			this.dismiss()
		}
	}

	render() {
		// Define the action buttons to display in the dialog
		const actions = [
			<FlatButton label="Delete" secondary={true} disabled={!this.state.editing} onTouchTap={() => this.delete()} />,
			<FlatButton label="Cancel" secondary={true} onTouchTap={() => this.dismiss()} />,
			<FlatButton label="Ok" secondary={true} onTouchTap={() => this.accept()} />
		]

		return (
			<Dialog contentClassName="dialog" title={this.state.dialogTitle} autoScrollBodyContent={true} actions={actions} open={this.state.open} onRequestClose={() => this.dismiss()}>
				<TextField id="name" className="form-input" floatingLabelText="Name" floatingLabelFixed={true} errorText={this.state.roomNameErrorText} onChange={(event) => this.handleChange(event.target.value, "roomName")} value={this.state.roomName} /><br />
				<TextField id="description" className="form-input" floatingLabelText="Description" floatingLabelFixed={true} onChange={(event) => this.handleChange(event.target.value, "roomDesc")} value={this.state.roomDesc} /><br />
				<Toggle label="Available for Booking" labelPosition="right" defaultToggled={this.state.isAvailable} onToggle={(event, isInputChecked) => this.handleChange(isInputChecked, "isAvailable")} value={this.state.isAvailable} />
			</Dialog>
		)
	}
}

// Define the property types that the component expects to receive
RoomDialogComponent.propTypes = {
	addRoom: PropTypes.func.isRequired,
	updateRoom: PropTypes.func.isRequired,
	deleteRoom: PropTypes.func.isRequired
}

// Define the container for the Room Dialog component (maps dispatchers)
const RoomDialog = connect(null, mapDispatchToProps, null, {withRef: true})(RoomDialogComponent)

export default RoomDialog
