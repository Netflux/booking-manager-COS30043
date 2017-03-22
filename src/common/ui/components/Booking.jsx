import React from 'react'
import { Paper } from 'material-ui'

const Booking = ({booking}) => (
	<div className="booking" style={{height: (56 * booking.duration) + "px"}} data-booking-id={booking.bookingId}>
		{
			booking.duration == 1 ? (
				<Paper className="paper">
					<p><strong>{booking.bookingTitle}</strong></p>
				</Paper>
			) : (
				<Paper className="paper">
					<p><strong>{booking.bookingTitle}</strong></p>
					<p>{booking.bookingDesc}</p>
				</Paper>
			)
		}
	</div>
)

export default Booking
