import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Define the Statistics Chart component
class StatisticsChart extends Component {
	componentDidMount() {
		const Chart = require('chart.js')

		this.chart = new Chart(this.canvas, this.props.options)
	}

	componentDidUpdate() {
		if (this.chart) {
			this.chart.data.datasets[0].data = this.props.options.data.datasets[0].data
			this.chart.update()
		}
	}

	componentWillUnmount() {
		if (this.chart) {
			this.chart.destroy()
		}
	}

	render() {
		return (
			<canvas className="chart" width={this.props.width || 400} height={this.props.height || 400} ref={(canvas) => this.canvas = canvas} />
		)
	}
}

// Define the property types that the component expects to receive
StatisticsChart.propTypes = {
	options: PropTypes.object.isRequired,
	width: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
	height: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
}

export default StatisticsChart
