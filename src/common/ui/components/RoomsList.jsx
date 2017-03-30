import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Card, CardActions, CardText, CardTitle, FlatButton, FloatingActionButton, FontIcon, Paper, RaisedButton } from 'material-ui'

import RoomDialog from './RoomDialog'

import { fetchRoomsIfNeeded, deleteRoom } from '../../actions'

const mapStateToProps = state => {
	return {
		rooms: state.rooms
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchRooms: () => {
			dispatch(fetchRoomsIfNeeded())
		},
		deleteCurrentRoom: (roomId) => {
			dispatch(deleteRoom(roomId))
		}
	}
}

// Define the Rooms List component
const RoomsListComponent = ({rooms, fetchRooms, deleteCurrentRoom}) => {
	// Fetch the rooms
	fetchRooms()

	// Store a reference to the Room Dialog component
	// Used to show the dialog when the user clicks on a room
	let roomDialog

	return (
		<section className="room-table">
			{
				rooms.items.length > 0 ? (
					<div className="row center-xs start-sm">
						{
							rooms.items.map((room) => (
								<div className="col-sm-6 col-xs-12" key={room.roomId}>
									<Paper className="paper paper-solo">
										<h1 className="room-header">{room.roomName}</h1>
										<p>{room.roomDesc}</p>
										<p>Booking Allowed: {room.isAvailable ? "Yes" : "No"}</p>

										<FlatButton label="Edit" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show({dialogTitle: "Edit Room", editing: true, ...room})} />
										<FlatButton label="Delete" secondary={true} onTouchTap={() => deleteCurrentRoom(room.roomId)} />
									</Paper>
								</div>
							))
						}
					</div>
				) : (
					<Paper className="paper text-center">
						<h1>No rooms available!</h1>
						<RaisedButton label="Add New Room" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show()} />
					</Paper>
				)
			}

			<FloatingActionButton className="fab" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show()}>
				<FontIcon className="material-icons">add</FontIcon>
			</FloatingActionButton>
			<RoomDialog ref={(dialog) => roomDialog = dialog} />
		</section>
	)
}

// Define the property types that the component expects to receive
RoomsListComponent.propTypes = {
	rooms: PropTypes.object.isRequired,
	fetchRooms: PropTypes.func.isRequired,
	deleteCurrentRoom: PropTypes.func.isRequired
}

// Define the container for the Rooms List component (maps state and dispatchers)
const RoomsList = connect(mapStateToProps, mapDispatchToProps)(RoomsListComponent)

export default RoomsList
