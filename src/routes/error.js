import { useRouteError, NavLink } from 'react-router-dom'
import styled from 'styled-components'

const ErrorContainer = styled.div`
	background-color: #fff;
	width: 50rem;
	padding: 2rem;
	border-radius: .6rem;
	box-shadow: hsl(0 0% 0% / 30%) 0 0 0.5rem 0.25rem;
	border: 1px solid #ccc;
	position: fixed;
	top: 50%;
	left: 50%;
	-webkit-transform: translateX(-50%) translateY(-50%);
	-moz-transform: translateX(-50%) translateY(-50%);
	-ms-transform: translateX(-50%) translateY(-50%);
	transform: translateX(-50%) translateY(-50%);
	text-align: center;
`

export default function ErrorPage() {
	const error = useRouteError()

	return <ErrorContainer>
		<p>An unexpected error has occurred:</p>
		<p><em>{error.statusText || error.message}</em></p>
		<p><NavLink className="app-like" to='/cups'>Go Home</NavLink></p>
	</ErrorContainer>
}
