import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RefreshIndicator } from 'material-ui'

const mapStateToProps = state => {
	return {
		isOpen: state.sideDrawerState.isOpen,
		bookingsByDate: state.bookingsByDate,
		loadingRooms: state.rooms.isFetching,
		loadingAccounts: state.accounts.isFetching,
		loadingStatistics: state.statistics.isFetching
	}
}

// Define the Refresh Spinner component
class RefreshSpinnerComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = { left: 0 }

		// Bind "this" to the function
		this.handleResize = this.handleResize.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isOpen !== this.state.isOpen) {
			this.setState({ left: (window.innerWidth / 2) - 28 + (nextProps.isOpen ? 128 : 0) })
		}
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
	}

	handleResize() {
		// Set a timeout of 250ms for handling window resize events
		if (!this.resizeTimer) {
			this.setState({ left: (window.innerWidth / 2) - 28 + (this.props.isOpen ? 128 : 0) })

			this.resizeTimer = setTimeout(() => {
				this.resizeTimer = false
			}, 250)
		}
	}

	render() {
		const isLoading = this.props.loadingRooms || this.props.loadingAccounts || this.props.loadingStatistics || (() => {
			for (let key in this.props.bookingsByDate) {
				if (this.props.bookingsByDate[key].isFetching) {
					return true
				}
			}

			return false
		})()

		return (
			<RefreshIndicator top={this.props.top} left={this.state.left} loadingColor="#FF9800" status={isLoading ? 'loading' : 'hide'} />
		)
	}
}

// Define the property types that the component expects to receive
RefreshSpinnerComponent.propTypes = {
	top: PropTypes.number.isRequired,
	isOpen: PropTypes.bool.isRequired,
	bookingsByDate: PropTypes.object.isRequired,
	loadingRooms: PropTypes.bool.isRequired,
	loadingAccounts: PropTypes.bool.isRequired,
	loadingStatistics: PropTypes.bool.isRequired
}

// Define the container for the Refresh Spinner component (maps state)
const RefreshSpinner = connect(mapStateToProps, null)(RefreshSpinnerComponent)

export default RefreshSpinner
