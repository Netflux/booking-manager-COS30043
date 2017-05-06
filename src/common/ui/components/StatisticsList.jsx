import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Paper } from 'material-ui'

import StatisticsChart from '../components/StatisticsChart'

import { fetchStatisticsIfNeeded } from '../../actions'

const mapStateToProps = state => {
	return {
		statistics: state.statistics
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchStatistics: () => {
			dispatch(fetchStatisticsIfNeeded())
		}
	}
}

// Define the Statistics List component
class StatisticsListComponent extends Component {
	componentDidMount() {
		// Fetch the statistics
		this.props.fetchStatistics()
	}

	componentDidUpdate() {
		// Fetch the statistics if outdated
		if (this.props.statistics.didInvalidate && !this.props.statistics.isFetching) {
			this.props.fetchStatistics()
		}
	}

	render() {
		const datasetPie = {
			backgroundColor: [
				'rgba(33, 150, 243, 0.5)',
				'rgba(255, 152, 0, 0.5)',
				'rgba(244, 67, 54, 0.5)',
				'rgba(76, 175, 80, 0.5)',
				'rgba(0, 150, 136, 0.5)',
				'rgba(63, 81, 181, 0.5)',
				'rgba(121, 85, 72, 0.5)',
				'rgba(156, 39, 176, 0.5)',
				'rgba(96, 125, 139, 0.5)',
				'rgba(103, 58, 183, 0.5)',
				'rgba(158, 158, 158, 0.5)',
				'rgba(233, 30, 99, 0.5)'
			],
			hoverBackgroundColor: [
				'rgba(33, 150, 243, 0.55)',
				'rgba(255, 152, 0, 0.55)',
				'rgba(244, 67, 54, 0.55)',
				'rgba(76, 175, 80, 0.55)',
				'rgba(0, 150, 136, 0.55)',
				'rgba(63, 81, 181, 0.55)',
				'rgba(121, 85, 72, 0.55)',
				'rgba(156, 39, 176, 0.55)',
				'rgba(96, 125, 139, 0.55)',
				'rgba(103, 58, 183, 0.55)',
				'rgba(158, 158, 158, 0.55)',
				'rgba(233, 30, 99, 0.55)'
			]
		}

		const datasetBar = {
			backgroundColor: [
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)',
				'rgba(33, 150, 243, 0.2)',
				'rgba(255, 152, 0, 0.2)'
			],
			hoverBackgroundColor: [
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)',
				'rgba(33, 150, 243, 0.25)',
				'rgba(255, 152, 0, 0.25)'
			],
			borderColor: [
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(255, 152, 0, 1)'
			],
			borderWidth: 1
		}

		// If no statistics are available, display a message
		if (!this.props.statistics.data) {
			return (
				<section>
					<Paper className="paper text-center">
						<h1>No statistics available!</h1>
						<p>Statistics will appear here as bookings and rooms are added.</p>
					</Paper>
				</section>
			)
		}

		// Generate chart data from statistics
		const thisMonth = {
			labels: [],
			data: []
		}
		const byMonth = {
			labels: [],
			data: []
		}

		const days = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, '18': 0, '19': 0, '20': 0, '21': 0, '22': 0, '23': 0, '24': 0, '25': 0, '26': 0, '27': 0, '28': 0, '29': 0, '30': 0, '31': 0 }
		const months = { 'January': 0, 'February': 0, 'March': 0, 'April': 0, 'May': 0, 'June': 0, 'July': 0, 'August': 0, 'September': 0, 'October': 0, 'November': 0, 'December': 0 }

		for (let i = 0; i < this.props.statistics.data.bookings.thisMonth.labels.length; ++i) {
			days[this.props.statistics.data.bookings.thisMonth.labels[i]] = this.props.statistics.data.bookings.thisMonth.data[i]
		}
		for (let i = 0; i < this.props.statistics.data.bookings.byMonth.labels.length; ++i) {
			months[this.props.statistics.data.bookings.byMonth.labels[i]] = this.props.statistics.data.bookings.byMonth.data[i]
		}

		for (let key in days) {
			thisMonth.labels.push(key)
			thisMonth.data.push(days[key])
		}
		for (let key in months) {
			byMonth.labels.push(key)
			byMonth.data.push(months[key])
		}

		return (
			<section>
				<div className="row center-xs start-sm padding-bottom">
					<div className="col-sm-6 col-xs-12 text-center">
						<Paper className="paper paper-solo paper-fullheight">
							<h1 className="header">Bookings This Month</h1>
							<StatisticsChart options={{
								type: 'horizontalBar',
								data: {
									labels: thisMonth.labels,
									datasets: [{
										...datasetBar,
										data: thisMonth.data
									}]
								},
								options: {
									legend: {
										display: false
									},
									scales: {
										xAxes: [{
											scaleLabel: {
												display: true,
												labelString: 'Bookings'
											}
										}],
										yAxes: [{
											scaleLabel: {
												display: true,
												labelString: 'Day of the Month'
											}
										}]
									}
								}
							}} height="880" />
						</Paper>
					</div>

					<div className="col-sm-6 col-xs-12">
						<div className="row center-xs start-sm">
							<div className="col-xs-12">
								<Paper className="paper paper-solo text-center">
									<h1 className="header">Bookings By Room</h1>
									<StatisticsChart options={{
										type: 'pie',
										data: {
											labels: this.props.statistics.data.bookings.byRoom.labels,
											datasets: [{
												...datasetPie,
												data: this.props.statistics.data.bookings.byRoom.data
											}]
										}
									}} />
								</Paper>
							</div>

							<div className="col-xs-12 text-center">
								<Paper className="paper paper-solo">
									<h1 className="header">Bookings By Month</h1>
									<StatisticsChart options={{
										type: 'bar',
										data: {
											labels: byMonth.labels,
											datasets: [{
												...datasetBar,
												data: byMonth.data
											}]
										},
										options: {
											legend: {
												display: false
											},
											scales: {
												yAxes: [{
													scaleLabel: {
														display: true,
														labelString: 'Bookings'
													}
												}]
											}
										}
									}} />
								</Paper>
							</div>
						</div>
					</div>

					<div className="col-xs-12">
						<Paper className="paper paper-solo">
							<h1 className="header">General Information</h1>
							<div className="row center-xs start-sm">
								<div className="col-sm-6 col-xs-12">
									<h2>Bookings</h2>
									<p>Total: {this.props.statistics.data.bookings.total}</p>
									<p>Most Popular Day: {this.props.statistics.data.bookings.mostPopular.day.label || 'None'}</p>
									<p>Most Popular Time: {this.props.statistics.data.bookings.mostPopular.time.label || 'None'}</p>
									<p>Most Popular Duration: {this.props.statistics.data.bookings.mostPopular.duration.label ? `${this.props.statistics.data.bookings.mostPopular.duration.label} hour(s)` : 'None'}</p>
								</div>

								<div className="col-sm-6 col-xs-12">
									<h2>Rooms</h2>
									<p>Total: {this.props.statistics.data.rooms.total}</p>
									<p>Available for Booking: {this.props.statistics.data.rooms.available}</p>
									<p>Not Available for Booking: {this.props.statistics.data.rooms.notAvailable}</p>
									<p>Most Popular: {this.props.statistics.data.rooms.mostPopular.label || 'None'}</p>
								</div>
							</div>
						</Paper>
					</div>
				</div>
			</section>
		)
	}
}

// Define the property types that the component expects to receive
StatisticsListComponent.propTypes = {
	statistics: PropTypes.object.isRequired,
	fetchStatistics: PropTypes.func.isRequired
}

// Define the container for the Statistics List component (maps state and dispatchers)
const StatisticsList = connect(mapStateToProps, mapDispatchToProps)(StatisticsListComponent)

export default StatisticsList
