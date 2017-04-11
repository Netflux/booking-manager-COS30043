import React, { PropTypes } from 'react'
import { Paper } from 'material-ui'

// Define the Booking component
const Booking = ({ booking, onTouchTap }) => (
	<div className="booking clickable" style={{ height: (56 * booking.duration) + 'px' }} onTouchTap={() => { onTouchTap ? onTouchTap() : null }}>
		{
			booking.duration === 1 ? (
				<Paper className="paper paper-solo">
					<p className="margin-none"><strong>{booking.bookingTitle}</strong></p>
				</Paper>
			) : (
				<Paper className="paper paper-solo">
					<p><strong>{booking.bookingTitle}</strong></p>
					<p>{booking.bookingDesc || 'No description provided'}</p>
				</Paper>
			)
		}
	</div>
)

// Define the property types that the component expects to receive
Booking.propTypes = {
	booking: PropTypes.object.isRequired,
	onTouchTap: PropTypes.func
}

export default Booking
