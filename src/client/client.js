import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import theme from '../common/ui/theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import configureStore from '../common/store/configureStore'
import routes from '../common/routes'

// Inject the tap event plugin to enable usage of onTouchTap
// More information: http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

// Fetch the default state provided by the server
const defaultState = window.__DEFAULT_STATE__

// Allow the provided state to be garbage-collected (now stored in defaultState)
delete window.__DEFAULT_STATE__

// Initialize the store with the default state
const store = configureStore(defaultState)

// Generate the default theme
const muiTheme = getMuiTheme({ ...theme })

// Render the application in the document body
render(
	<Provider store={store}>
		<MuiThemeProvider muiTheme={muiTheme}>
			<Router history={browserHistory}>
				{routes}
			</Router>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('app')
)
