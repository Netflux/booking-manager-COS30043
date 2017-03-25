import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Card, CardActions, CardText, CardTitle, FlatButton, Paper } from 'material-ui'

import { fetchRoomsIfNeeded } from '../../actions'

const mapStateToProps = state => {
	return {
		rooms: state.rooms
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchRooms: () => {
			dispatch(fetchRoomsIfNeeded())
		}
	}
}

// Define the Rooms List component
const RoomsListComponent = ({rooms, fetchRooms}) => {
	// Fetch the rooms
	fetchRooms()

	return (
		<section>
			{
				rooms.items.length > 0 ? (
					<div className="row center-xs start-sm">
						{
							rooms.items.map((room) => (
								<div className="col-sm-6" key={room.roomId}>
									<Paper className="paper paper-room">
										<h1>{room.roomName}</h1>
										<p>{room.roomDesc}</p>
										<p>Booking Allowed: {room.isAvailable ? "Yes" : "No"}</p>

										<FlatButton label="Edit" secondary={true} />
										<FlatButton label="Delete" secondary={true} />
									</Paper>
								</div>
							))
						}
					</div>
				) : (
					<Paper className="paper text-center">
						<h1>No rooms available!</h1>
						<p>If you're seeing this message, please contact the system administrator.</p>
					</Paper>
				)
			}
		</section>
	)
}

// Define the property types that the component expects to receive
RoomsListComponent.propTypes = {
	rooms: PropTypes.object.isRequired,
	fetchRooms: PropTypes.func.isRequired
}

// Define the container for the Rooms List component (maps state and dispatchers)
const RoomsList = connect(mapStateToProps, mapDispatchToProps)(RoomsListComponent)

export default RoomsList
