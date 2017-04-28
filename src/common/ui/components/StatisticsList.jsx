import React, { Component } from 'react'
import { Paper } from 'material-ui'

import BookingDatePicker from '../components/BookingDatePicker'
import StatisticsChart from '../components/StatisticsChart'

// Define the Statistics List component
class StatisticsList extends Component {
	render() {
		return (
			<section>
				<div className="row center-xs start-sm padding-bottom">
					<div className="col-sm-6 col-xs-12">
						<Paper className="paper paper-solo text-center">
							<h1 className="header">Bookings By Room</h1>
							<StatisticsChart options={{
								type: 'pie',
								data: {
									labels: [
										'Room 1',
										'Room 2',
										'Room 3',
										'Room 4',
										'Room 5',
										'Room 6',
										'Room 7',
										'Room 8',
										'Room 9',
										'Room 10',
										'Room 11',
										'Room 12'
									],
									datasets: [{
										data: [300, 50, 100, 200, 100, 100, 100, 100, 100, 100, 100, 100],
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
									}]
								}
							}} />
						</Paper>
					</div>

					<div className="col-sm-6 col-xs-12 text-center">
						<Paper className="paper paper-solo">
							<h1 className="header">Bookings By Month</h1>
							<StatisticsChart options={{
								type: 'bar',
								data: {
									labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
									datasets: [{
										data: [65, 59, 80, 81, 56, 55, 40, 67, 34, 42, 20, 72],
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
											'rgba(255, 152, 0, 1)'
										],
										borderWidth: 1
									}]
								},
								options: {
									legend: {
										display: false
									}
								}
							}} />
						</Paper>
					</div>

					<div className="col-xs-12">
						<Paper className="paper paper-solo">
							<h1 className="header">General Information</h1>
							<div className="row center-xs start-sm">
								<div className="col-sm-6 col-xs-12">
									<h2>Bookings</h2>
									<p>Total: 4</p>
									<p>Most Popular Day: Monday</p>
									<p>Most Popular Time: 10:30am</p>
									<p>Most Popular Duration: 1 hour(s)</p>
								</div>

								<div className="col-sm-6 col-xs-12">
									<h2>Rooms</h2>
									<p>Total: 3</p>
									<p>Available for Booking: 2</p>
									<p>Not Available for Booking: 1</p>
									<p>Most Popular: Room 1</p>
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
StatisticsList.propTypes = {

}

export default StatisticsList
