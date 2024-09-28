import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store'

import './pokemon.css'
import './index.css'

import Root from './routes/root'
import Index from './routes/index'
import Season, { loader as seasonLoader } from './routes/season'
import Error from './routes/error'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <Index /> },
			{
				path: "season/:seasonId?/:cupId?",
				element: <Season />,
				loader: seasonLoader,
			}
		],
		errorElement: <Error />
	}
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<RouterProvider router={router} />
			</PersistGate>
		</Provider>
	</React.StrictMode>
)