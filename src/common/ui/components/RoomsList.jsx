import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, FloatingActionButton, FontIcon, Paper, RaisedButton } from 'material-ui'

import RoomDialog from './RoomDialog'

import { fetchRoomsIfNeeded, handleDeleteRoom } from '../../actions'

const mapStateToProps = state => {
	return {
		rooms: state.rooms,
		isLoggedIn: state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchRooms: () => {
			dispatch(fetchRoomsIfNeeded())
		},
		deleteRoom: (roomId) => {
			dispatch(handleDeleteRoom(roomId))
		}
	}
}

// Define the Rooms List component
class RoomsListComponent extends Component {
	componentDidMount() {
		// Fetch the rooms
		this.props.fetchRooms()
	}

	render() {
		// Store a reference to the Room Dialog component
		// Used to show the dialog when the user clicks on a room
		let roomDialog

		return (
			<section className="room-table">
				{
					this.props.rooms.items.length > 0 ? (
						<div className="row center-xs start-sm">
							{
								this.props.rooms.items.map((room) => (
									<div className="col-sm-6 col-xs-12" key={room.roomId}>
										<Paper className="paper paper-solo">
											<h1 className="room-header">{room.roomName}</h1>
											<p>{room.roomDesc || 'No description provided'}</p>
											<p>Booking Allowed: {room.isAvailable ? 'Yes' : 'No'}</p>

											{
												// Only display the Edit/Delete buttons if the user is logged in
												this.props.isLoggedIn && (
													<div>
														<FlatButton label="Edit" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show({ dialogTitle: 'Edit Room', editing: true, ...room })} />
														<FlatButton label="Delete" secondary={true} onTouchTap={() => this.props.deleteRoom(room.roomId)} />
													</div>
												)
											}
										</Paper>
									</div>
								))
							}
						</div>
					) : (
						<Paper className="paper text-center">
							<h1>No rooms available!</h1>

							{
								// If logged in, display the 'Add New Room' button
								// Else, display a message to the user
								this.props.isLoggedIn ? (
									<RaisedButton label="Add New Room" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show()} />
								) : (
									<p>If you're seeing this message, please contact the system administrator.</p>
								)
							}
						</Paper>
					)
				}

				{
					// If logged in, display the FAB for adding new rooms
					this.props.isLoggedIn && (
						<FloatingActionButton className="fab" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show()}>
							<FontIcon className="material-icons">add</FontIcon>
						</FloatingActionButton>
					)
				}

				<RoomDialog ref={(dialog) => roomDialog = dialog} />
			</section>
		)
	}
}

// Define the property types that the component expects to receive
RoomsListComponent.propTypes = {
	rooms: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	fetchRooms: PropTypes.func.isRequired,
	deleteRoom: PropTypes.func.isRequired
}

// Define the container for the Rooms List component (maps state and dispatchers)
const RoomsList = connect(mapStateToProps, mapDispatchToProps)(RoomsListComponent)

export default RoomsList
