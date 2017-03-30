// Action when the user opens/closes the side drawer
export const TOGGLE_DRAWER_OPEN = 'TOGGLE_DRAWER_OPEN'
export const toggleDrawerOpen = () => {
	return {
		type: TOGGLE_DRAWER_OPEN
	}
}

// Action when the user docks/undocks the side drawer
export const TOGGLE_DRAWER_DOCKED = 'TOGGLE_DRAWER_DOCKED'
export const toggleDrawerDocked = () => {
	return {
		type: TOGGLE_DRAWER_DOCKED
	}
}

// Action when the user selects a specific date to show
export const SELECT_DATE = 'SELECT_DATE'
export const selectDate = date => {
	return {
		type: SELECT_DATE,
		date
	}
}

// Helper function to determine whether booking entries need to be fetched for a specific date
const shouldFetchBookings = (state, date) => {
	const bookings = state.bookingsByDate[date]

	if (!bookings) {
		return true;
	} else if (bookings.isFetching) {
		return false
	} else {
		return bookings.didInvalidate
	}
}

// Action when the user needs to fetch booking entries
export const fetchBookingsIfNeeded = date => {
	return (dispatch, getState) => {
		// Fetch booking entries if not in memory, else return a resolved promise
		if (shouldFetchBookings(getState(), date)) {
			return dispatch(fetchBookings(date))
		} else {
			return Promise.resolve()
		}
	}
}

// Action when the user is fetching booking entries
export const fetchBookings = date => {
	return dispatch => {
		// Dispatch a request bookings action
		dispatch(requestBookings(date))

		// Fetch the booking entries and dispatch a receive bookings action
		return fetch(`/api/bookings/${date}`)
			.then(response => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(`HTTP Error ${response.status}: Failed to fetch bookings (${date})`)
			})
			.then(json => dispatch(receiveBookings(date, json)))
			.catch(error => {
				console.log(error)
				dispatch(receiveBookingsError())
			})
	}
}

// Action when the user requests booking entries
export const REQUEST_BOOKINGS = 'REQUEST_BOOKINGS'
export const requestBookings = date => {
	return {
		type: REQUEST_BOOKINGS,
		date
	}
}

// Action when the user receives booking entries
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'
export const receiveBookings = (date, json) => {
	return {
		type: RECEIVE_BOOKINGS,
		date,
		bookings: json,
		receivedAt: Date.now()
	}
}

// Action when the bookings request action encounters an error
export const RECEIVE_BOOKINGS_ERROR = 'RECEIVE_BOOKINGS_ERROR'
export const receiveBookingsError = () => {
	return {
		type: RECEIVE_BOOKINGS_ERROR
	}
}

// Action when the booking entries have become invalid (after add/delete)
export const INVALIDATE_BOOKINGS = 'INVALIDATE_BOOKINGS'
export const invalidateBookings = date => {
	return {
		type: INVALIDATE_BOOKINGS,
		date
	}
}

// Action when the user adds a booking entry
export const ADD_BOOKING = 'ADD_BOOKING'
export const addBooking = (date, booking) => {
	return {
		type: ADD_BOOKING,
		date,
		booking
	}
}

// Action when the user deletes a booking entry
export const DELETE_BOOKING = 'DELETE_BOOKING'
export const deleteBooking = (date, bookingId) => {
	return {
		type: DELETE_BOOKING,
		date,
		bookingId
	}
}

// Helper function to determine whether room entries need to be fetched
const shouldFetchRooms = (state) => {
	const rooms = state.rooms

	if (!rooms) {
		return true;
	} else if (rooms.isFetching) {
		return false
	} else {
		return rooms.didInvalidate
	}
}

// Action when the user needs to fetch room entries
export const fetchRoomsIfNeeded = () => {
	return (dispatch, getState) => {
		// Fetch room entries if not in memory, else return a resolved promise
		if (shouldFetchRooms(getState())) {
			return dispatch(fetchRooms())
		} else {
			return Promise.resolve()
		}
	}
}

// Action when the user is fetching room entries
export const fetchRooms = () => {
	return dispatch => {
		// Dispatch a request rooms action
		dispatch(requestRooms())

		// Fetch the room entries and dispatch a receive rooms action
		return fetch('/api/rooms/')
			.then(response => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(`HTTP Error ${response.status}: Failed to fetch rooms`)
			})
			.then(json => dispatch(receiveRooms(json)))
			.catch(error => {
				console.log(error)
				dispatch(receiveRoomsError())
			})
	}
}

// Action when the user requests room entries
export const REQUEST_ROOMS = 'REQUEST_ROOMS'
export const requestRooms = () => {
	return {
		type: REQUEST_ROOMS
	}
}

// Action when the user receives room entries
export const RECEIVE_ROOMS = 'RECEIVE_ROOMS'
export const receiveRooms = (json) => {
	return {
		type: RECEIVE_ROOMS,
		rooms: json,
		receivedAt: Date.now()
	}
}

// Action when the room request action encounters an error
export const RECEIVE_ROOMS_ERROR = 'RECEIVE_ROOMS_ERROR'
export const receiveRoomsError = () => {
	return {
		type: RECEIVE_ROOMS_ERROR
	}
}

// Action when the room entries have become invalid (after add/delete)
export const INVALIDATE_ROOMS = 'INVALIDATE_ROOMS'
export const invalidateRooms = () => {
	return {
		type: INVALIDATE_ROOMS
	}
}

// Action when the user adds a room entry
export const ADD_ROOM = 'ADD_ROOM'
export const addRoom = (room) => {
	return {
		type: ADD_ROOM,
		room
	}
}

// Action when the user deletes a room entry
export const DELETE_ROOM = 'DELETE_ROOM'
export const deleteRoom = (roomId) => {
	return {
		type: DELETE_ROOM,
		roomId
	}
}

// Action when the login process has begun
export const BEGIN_LOGIN = 'BEGIN_LOGIN'
export const beginLogin = () => {
	return {
		type: BEGIN_LOGIN
	}
}

// Action when the login process has been completed
export const COMPLETE_LOGIN = 'COMPLETE_LOGIN'
export const completeLogin = (json) => {
	return {
		type: COMPLETE_LOGIN,
		response: json
	}
}

// Action when the login process encounters an error
export const COMPLETE_LOGIN_ERROR = 'COMPLETE_LOGIN_ERROR'
export const completeLoginError = () => {
	return {
		type: COMPLETE_LOGIN_ERROR
	}
}

// Action when the user logs in
export const requestLogin = (username, password) => {
	return dispatch => {
		// Dispatch a begin login action
		dispatch(beginLogin())

		// Send the username and password to the server for authentication
		fetch('/api/login', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({username: username, password: password})
		})
		.then(response => {
			if (response.ok) {
				return response.json()
			}
			throw new Error(`HTTP Error ${response.status}: Failed to login`)
		})
		.then(json => dispatch(completeLogin(json)))
		.catch(error => {
			console.log(error)
			dispatch(completeLoginError())
		})
	}
}
