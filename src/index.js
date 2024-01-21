import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store'

import './pokemon.css'
import './index.css'

import Root from './routes/root'
import Index from './routes/index'
import Cups, { loader as cupLoader } from './routes/cups'
import Error from './routes/error'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <Index /> },
			{
				path: "cups/:cupId?",
				element: <Cups />,
				loader: cupLoader,
			}
		],
		errorElement: <Error />
	}
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
)