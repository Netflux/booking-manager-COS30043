import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configureStore'
import routes from '../common/routes'

// Fetch the default state provided by the server
const defaultState = window.__DEFAULT_STATE__

// Allow the provided state to be garbage-collected (now stored in defaultState)
delete window.__DEFAULT_STATE__

// Initialize the store with the default state
const store = configureStore(defaultState)

// Render the application in the document body
render(
	<Provider store={store}>
		<Router history={browserHistory}>
			{routes}
		</Router>
	</Provider>,
	document.getElementById('app')
)
