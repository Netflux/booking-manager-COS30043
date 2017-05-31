import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'

import { hideSnackbar } from '../../actions'

const mapStateToProps = state => {
	return {
		open: state.snackbar.open,
		message: state.snackbar.message,
		action: state.snackbar.action,
		onActionTouchTap: state.snackbar.onActionTouchTap
	}
}

const mapDispatchToProps = dispatch => {
	return {
		closeSnackbar: () => {
			dispatch(hideSnackbar())
		}
	}
}

// Define the Snackbar component
class SnackbarComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = {
			open: this.props.open
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.open !== nextProps.open) {
			this.setState({ open: nextProps.open })
		}
	}

	render() {
		return (
			<Snackbar open={this.state.open} autoHideDuration={3500} message={this.props.message} action={this.props.action} onActionTouchTap={this.props.onActionTouchTap} onRequestClose={this.props.closeSnackbar} />
		)
	}
}

// Define the property types that the component expects to receive
SnackbarComponent.propTypes = {
	closeSnackbar: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	action: PropTypes.string,
	onActionTouchTap: PropTypes.func
}

// Define the container for the Snackbar component (maps state and dispatchers)
export default connect(mapStateToProps, mapDispatchToProps)(SnackbarComponent)
