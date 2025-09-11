import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	createHashRouter,
	RouterProvider
} from 'react-router-dom'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store'

import './pokemon.css'
import './index.css'

import Root from './routes/root'
import Index from './routes/index'
import Cup, { loader as cupLoader } from './routes/cup'
import Settings from './routes/settings'
import Error from './routes/error'

const routes = [
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <Index /> },
			{
				path: "cup/:cupId",
				element: <Cup />,
				loader: cupLoader,
			},
			{
				path: "settings",
				element: <Settings />
			}
		],
		errorElement: <Error />
	}
]

const isGitHubPages = true //process.env.REACT_APP_ROUTER === 'hash'

const router = isGitHubPages
  ? createHashRouter(routes)
  : createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<RouterProvider router={router} />
			</PersistGate>
		</Provider>
	</React.StrictMode>
)