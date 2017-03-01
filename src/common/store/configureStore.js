import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

// Helper function to create and initialize the store
const configureStore = (currentState) => {
	return createStore(
		rootReducer,
		currentState,
		applyMiddleware(
			thunkMiddleware
		)
	)
}

export default configureStore
