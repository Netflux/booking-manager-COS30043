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
		return true
	} else if (bookings.isFetching) {
		return false
	} else {
		return bookings.didInvalidate
	}
}

// Action when the user needs to fetch booking entries
export const fetchBookingsIfNeeded = date => {
	return (dispatch, getState) => {
		// Fetch booking entries if not in memory or invalidated, else return a resolved promise
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
		// Dispatch a 'Request Bookings' action
		dispatch(requestBookings(date))

		// Fetch the booking entries and dispatch a 'Receive Bookings' action
		return fetch(`/api/bookings/${date}`, { credentials: 'include' })
			.then(response => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(`HTTP Error ${response.status}: Failed to fetch bookings (${date})`)
			})
			.then(json => dispatch(receiveBookings(date, json)))
			.catch(() => {
				dispatch(receiveBookingsError())
			})
	}
}

// Action when the user requests booking entries
export const REQUEST_BOOKINGS = 'REQUEST_BOOKINGS'
const requestBookings = date => {
	return {
		type: REQUEST_BOOKINGS,
		date
	}
}

// Action when the user receives booking entries
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'
const receiveBookings = (date, json) => {
	return {
		type: RECEIVE_BOOKINGS,
		date,
		bookings: json,
		receivedAt: Date.now()
	}
}

// Action when the bookings request action encounters an error
export const RECEIVE_BOOKINGS_ERROR = 'RECEIVE_BOOKINGS_ERROR'
const receiveBookingsError = () => {
	return {
		type: RECEIVE_BOOKINGS_ERROR
	}
}

// Action when the booking entries have become invalid
export const INVALIDATE_BOOKINGS = 'INVALIDATE_BOOKINGS'
export const invalidateBookings = date => {
	return {
		type: INVALIDATE_BOOKINGS,
		date
	}
}

// Action when the user adds a booking entry (server-side)
export const handleAddBooking = booking => {
	return dispatch => {
		// Dispatch a 'Add Booking' action
		dispatch(addBooking(booking.date, booking))

		// Send the booking entry to the server for storage
		return fetch('/api/bookings', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(booking)
		})
		.then(response => {
			if (response.ok) {
				// Dispatch a 'Invalidate Statistics' action
				dispatch(invalidateStatistics())

				return // Add booking succeeded
			}
			throw new Error(`HTTP Error ${response.status}: Failed to add booking`)
		})
		.catch(() => {
			// Add booking failed, no action required
		})
	}
}

// Action when the user adds a booking entry
export const ADD_BOOKING = 'ADD_BOOKING'
const addBooking = (date, booking) => {
	return {
		type: ADD_BOOKING,
		date,
		booking
	}
}

// Action when the user updates a booking entry (server-side)
export const handleUpdateBooking = booking => {
	return dispatch => {
		// Dispatch a 'Update Booking' action
		dispatch(updateBooking(booking.date, booking))

		// Send the updated booking entry to the server for storage
		return fetch(`/api/bookings/${booking.bookingId}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(booking)
		})
		.then(response => {
			if (response.ok) {
				// Dispatch a 'Invalidate Statistics' action
				dispatch(invalidateStatistics())

				return // Update booking succeeded
			}
			throw new Error(`HTTP Error ${response.status}: Failed to update booking`)
		})
		.catch(() => {
			// Update booking failed, no action required
		})
	}
}

// Action when the user updates a booking entry
export const UPDATE_BOOKING = 'UPDATE_BOOKING'
const updateBooking = (date, booking) => {
	return {
		type: UPDATE_BOOKING,
		date,
		booking
	}
}

// Action when the user deletes a booking entry (server-side)
export const handleDeleteBooking = (date, bookingId) => {
	return dispatch => {
		// Dispatch a 'Delete Booking' action
		dispatch(deleteBooking(date, bookingId))

		// Delete the booking entry on the server
		return fetch(`/api/bookings/${bookingId}`, {
			method: 'DELETE',
			credentials: 'include'
		})
		.then(response => {
			if (response.ok) {
				// Dispatch a 'Invalidate Statistics' action
				dispatch(invalidateStatistics())

				return // Delete booking succeeded
			}
			throw new Error(`HTTP Error ${response.status}: Failed to delete booking`)
		})
		.catch(() => {
			// Delete booking failed, no action required
		})
	}
}

// Action when the user deletes a booking entry
export const DELETE_BOOKING = 'DELETE_BOOKING'
const deleteBooking = (date, bookingId) => {
	return {
		type: DELETE_BOOKING,
		date,
		bookingId
	}
}

// Helper function to determine whether room entries need to be fetched
const shouldFetchRooms = state => {
	const rooms = state.rooms

	if (rooms.items.length === 0) {
		return true
	} else if (rooms.isFetching) {
		return false
	} else {
		return rooms.didInvalidate
	}
}

// Action when the user needs to fetch room entries
export const fetchRoomsIfNeeded = () => {
	return (dispatch, getState) => {
		// Fetch room entries if not in memory or invalidated, else return a resolved promise
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
		// Dispatch a 'Request Rooms' action
		dispatch(requestRooms())

		// Fetch the room entries and dispatch a 'Receive Rooms' action
		return fetch('/api/rooms', { credentials: 'include' })
			.then(response => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(`HTTP Error ${response.status}: Failed to fetch rooms`)
			})
			.then(json => dispatch(receiveRooms(json)))
			.catch(() => {
				dispatch(receiveRoomsError())
			})
	}
}

// Action when the user requests room entries
export const REQUEST_ROOMS = 'REQUEST_ROOMS'
const requestRooms = () => {
	return {
		type: REQUEST_ROOMS
	}
}

// Action when the user receives room entries
export const RECEIVE_ROOMS = 'RECEIVE_ROOMS'
const receiveRooms = json => {
	return {
		type: RECEIVE_ROOMS,
		rooms: json,
		receivedAt: Date.now()
	}
}

// Action when the room request action encounters an error
export const RECEIVE_ROOMS_ERROR = 'RECEIVE_ROOMS_ERROR'
const receiveRoomsError = () => {
	return {
		type: RECEIVE_ROOMS_ERROR
	}
}

// Action when the room entries have become invalid
export const INVALIDATE_ROOMS = 'INVALIDATE_ROOMS'
export const invalidateRooms = () => {
	return {
		type: INVALIDATE_ROOMS
	}
}

// Action when the user adds a room entry (server-side)
export const handleAddRoom = room => {
	return dispatch => {
		// Dispatch a 'Add Room' action
		dispatch(addRoom(room))

		// Send the room entry to the server for storage
		return fetch('/api/rooms', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(room)
		})
		.then(response => {
			if (response.ok) {
				// Dispatch a 'Invalidate Statistics' action
				dispatch(invalidateStatistics())

				return // Add room succeeded
			}
			throw new Error(`HTTP Error ${response.status}: Failed to add room`)
		})
		.catch(() => {
			// Add room failed, no action required
		})
	}
}

// Action when the user adds a room entry (client-side)
export const ADD_ROOM = 'ADD_ROOM'
const addRoom = room => {
	return {
		type: ADD_ROOM,
		room
	}
}

// Action when the user updates a room entry (server-side)
export const handleUpdateRoom = room => {
	return dispatch => {
		// Dispatch a 'Update Room' action
		dispatch(updateRoom(room))

		// Send the updated room entry to the server for storage
		return fetch(`/api/rooms/${room.roomId}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(room)
		})
		.then(response => {
			if (response.ok) {
				// Dispatch a 'Invalidate Statistics' action
				dispatch(invalidateStatistics())

				return // Update room succeeded
			}
			throw new Error(`HTTP Error ${response.status}: Failed to update room`)
		})
		.catch(() => {
			// Update room failed, no action required
		})
	}
}

// Action when the user updates a room entry (client-side)
export const UPDATE_ROOM = 'UPDATE_ROOM'
const updateRoom = room => {
	return {
		type: UPDATE_ROOM,
		room
	}
}

// Action when the user deletes a room entry (server-side)
export const handleDeleteRoom = roomId => {
	return dispatch => {
		// Dispatch a 'Delete Room' action
		dispatch(deleteRoom(roomId))

		// Delete the room entry on the server
		return fetch(`/api/rooms/${roomId}`, {
			method: 'DELETE',
			credentials: 'include'
		})
		.then(response => {
			if (response.ok) {
				// Dispatch a 'Invalidate Statistics' action
				dispatch(invalidateStatistics())

				return // Delete room succeeded
			}
			throw new Error(`HTTP Error ${response.status}: Failed to delete room`)
		})
		.catch(() => {
			// Delete room failed, no action required
		})
	}
}

// Action when the user deletes a room entry (client-side)
export const DELETE_ROOM = 'DELETE_ROOM'
const deleteRoom = roomId => {
	return {
		type: DELETE_ROOM,
		roomId
	}
}

// Action when the login process has begun
export const BEGIN_LOGIN = 'BEGIN_LOGIN'
const beginLogin = () => {
	return {
		type: BEGIN_LOGIN
	}
}

// Action when the login process has been completed
export const COMPLETE_LOGIN = 'COMPLETE_LOGIN'
const completeLogin = json => {
	return {
		type: COMPLETE_LOGIN,
		response: json
	}
}

// Action when the login process encounters an error
export const COMPLETE_LOGIN_ERROR = 'COMPLETE_LOGIN_ERROR'
const completeLoginError = () => {
	return {
		type: COMPLETE_LOGIN_ERROR
	}
}

// Action when the login error is no longer required
export const CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR'
export const clearLoginError = () => {
	return {
		type: CLEAR_LOGIN_ERROR
	}
}

// Action when the user logs in
export const requestLogin = (username, password) => {
	return dispatch => {
		// Dispatch a 'Begin Login' action
		dispatch(beginLogin())

		// Send the username and password to the server for authentication
		return fetch('/api/login', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({username: username, password: password})
		})
		.then(response => {
			if (response.ok) {
				return response.json()
			}
			throw new Error(`HTTP Error ${response.status}: Failed to login`)
		})
		.then(json => dispatch(completeLogin(json)))
		.catch(() => {
			dispatch(completeLoginError())
		})
	}
}

export const COMPLETE_LOGOUT = 'COMPLETE_LOGOUT'
const completeLogout = () => {
	return {
		type: COMPLETE_LOGOUT
	}
}

// Action when the user logs out
export const requestLogout = () => {
	return dispatch => {
		// Send the username and password to the server for authentication
		return fetch('/api/logout', { credentials: 'include' })
			.then(response => {
				if (response.ok) {
					return dispatch(completeLogout())
				}
				throw new Error(`HTTP Error ${response.status}: Failed to logout`)
			})
			.catch(() => {
				// Logout failed, no action required
			})
	}
}

// Action when the user is fetching search results
export const fetchSearchResults = query => {
	return dispatch => {
		// Dispatch a 'Request Search Results' action
		dispatch(requestSearchResults(query))

		// Fetch the search results and dispatch a 'Receive Search Results' action
		return fetch(`/api/search/${query}`, { credentials: 'include' })
			.then(response => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(`HTTP Error ${response.status}: Failed to fetch search results (${query})`)
			})
			.then(json => dispatch(receiveSearchResults(json)))
			.catch(() => {
				// If online search failed, search for results locally
				dispatch(fetchSearchResultsLocal(query))
			})
	}
}

// Action when the user is fetching search results (local)
const fetchSearchResultsLocal = query => {
	return (dispatch, getState) => {
		// Dispatch a 'Request Search Results' action (local)
		dispatch(requestSearchResultsLocal(query))

		const state = getState()

		const results = {
			bookings: [],
			rooms: []
		}

		if (state.search.query !== '') {
			const regexp = new RegExp(query)

			for (let key in state.bookingsByDate) {
				for (let i = 0; i < state.bookingsByDate[key].items.length; ++i) {
					const booking = state.bookingsByDate[key].items[i]

					if (regexp.test(booking.bookingId) || regexp.test(booking.bookingTitle) || regexp.test(booking.bookingDesc) || regexp.test(booking.roomId) || regexp.test(booking.date)) {
						results.bookings.push(booking)
					}
				}
			}

			for (let i = 0; i < state.rooms.items.length; ++i) {
				const room = state.rooms.items[i]

				if (regexp.test(room.roomId) || regexp.test(room.roomName) || regexp.test(room.roomDesc)) {
					results.rooms.push(room)
				}
			}
		}

		dispatch(receiveSearchResults(results))
	}
}

// Action when the user requests search results
export const REQUEST_SEARCH_RESULTS = 'REQUEST_SEARCH_RESULTS'
const requestSearchResults = query => {
	return {
		type: REQUEST_SEARCH_RESULTS,
		query
	}
}

// Action when the user requests search results (local)
export const REQUEST_SEARCH_RESULTS_LOCAL = 'REQUEST_SEARCH_RESULTS_LOCAL'
const requestSearchResultsLocal = query => {
	return {
		type: REQUEST_SEARCH_RESULTS_LOCAL,
		query
	}
}

// Action when the user receives search results
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS'
const receiveSearchResults = json => {
	return {
		type: RECEIVE_SEARCH_RESULTS,
		bookings: json.bookings,
		rooms: json.rooms
	}
}

// Action when the search results are no longer required
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS'
export const clearSearchResults = () => {
	return {
		type: CLEAR_SEARCH_RESULTS
	}
}

// Helper function to determine whether statistics need to be fetched
const shouldFetchStatistics = state => {
	const statistics = state.statistics

	if (!statistics.data) {
		return true
	} else if (statistics.isFetching) {
		return false
	} else {
		return statistics.didInvalidate
	}
}

// Action when the user needs to fetch statistics
export const fetchStatisticsIfNeeded = () => {
	return (dispatch, getState) => {
		// Fetch statistics if not in memory or invalidated, else return a resolved promise
		if (shouldFetchStatistics(getState())) {
			return dispatch(fetchStatistics())
		} else {
			return Promise.resolve()
		}
	}
}

// Action when the user is fetching statistics
export const fetchStatistics = () => {
	return dispatch => {
		// Dispatch a 'Request Statistics' action
		dispatch(requestStatistics())

		// Fetch the statistics and dispatch a 'Receive Statistics' action
		return fetch('/api/statistics', { credentials: 'include' })
			.then(response => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(`HTTP Error ${response.status}: Failed to fetch statistics`)
			})
			.then(json => dispatch(receiveStatistics(json)))
			.catch(() => {
				dispatch(receiveStatisticsError())
			})
	}
}

// Action when the user requests statistics
export const REQUEST_STATISTICS = 'REQUEST_STATISTICS'
const requestStatistics = () => {
	return {
		type: REQUEST_STATISTICS
	}
}

// Action when the user receives statistics
export const RECEIVE_STATISTICS = 'RECEIVE_STATISTICS'
const receiveStatistics = json => {
	return {
		type: RECEIVE_STATISTICS,
		data: json
	}
}

// Action when the statistics request action encounters an error
export const RECEIVE_STATISTICS_ERROR = 'RECEIVE_STATISTICS_ERROR'
const receiveStatisticsError = () => {
	return {
		type: RECEIVE_STATISTICS_ERROR
	}
}

// Action when the statistics have become invalid
export const INVALIDATE_STATISTICS = 'INVALIDATE_STATISTICS'
export const invalidateStatistics = () => {
	return {
		type: INVALIDATE_STATISTICS
	}
}
