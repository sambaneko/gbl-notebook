import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Modal from '../components/Modal'
import Settings from '../components/Settings'
import styled from 'styled-components'

export default function Root() {
	const Menu = styled.nav`
		color: #fff;
		text-transform: uppercase;
		background-color: #104c55;
		font-size: 1.2rem;
		padding: 0 2rem;
		display: flex;
		position: fixed;
		top: 0;
		z-index: 5;
		width: 100%;
		box-sizing: border-box;

		& ul {
			flex: 1 1 auto;
			display: flex;
			list-style-type: none;
		}
		& ul:last-child {
			justify-content: right;
		}
		& a, a:link, a:visited, button {
			margin: .4rem;
			padding: .6rem 2rem;
			display: inline-block;		
			color: inherit;
			text-transform: uppercase;
			border-radius: 3rem;
			text-decoration: none;
			transition: all 0.1s ease-out;
			border: none;
  			background: transparent;
		}
		& a:hover, a:active, button:hover {
			background-color: rgba(0, 0, 0, 0.5);
		}
	`

	const [modalContents, setModalContents] = useState(null)
	const showModal = (modal) => setModalContents(modal)

	return <>
		<Menu>
			<ul>
				<li style={{ lineHeight: '3.6rem', fontWeight: 700 }}>
					GBL Notebook
				</li>
			</ul>
			<ul>
				<li>
					<button onClick={() => showModal(<Settings />)}>Settings</button>
				</li>
			</ul>
		</Menu>
		{modalContents &&
			<Modal onClose={() => setModalContents(null)}>
				{modalContents}
			</Modal>
		}
		<Outlet context={[showModal]} />
	</>
}