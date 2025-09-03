import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Modal from '../components/Modal'
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
			line-height: 4rem;
			padding: 0 2rem;
			display: inline-block;		
			color: inherit;
			text-transform: uppercase;
			text-decoration: none;
			transition: all 0.1s ease-out;
			border: none;
  			background: transparent;
			font-size: 1.4rem;
			font-weight: 400;
		}
		& a:hover, a:active, button:hover {
			background-color: rgba(0, 0, 0, 0.5);
		}
		& a.current, a.current:link, a.current:visited {
			background-color: #ffffff50;
		}
		& .page-links li a {
			border-radius: 1rem 1rem 0 0;
		}
		& .page-links li a.current {
			color: #104c55;
			background: #fff;
		}			
		& .page-links li:last-child .current {
			background: rgb(180, 240, 156);
  		}
	`

	const [modalContents, setModalContents] = useState(null)
	const showModal = (modal) => setModalContents(modal)

	const location = useLocation()
	const notesIsActive = location.pathname === '/' ||
		location.pathname.startsWith('/cup')

	return <>
		<Menu>
			<ul>
				<li style={{ lineHeight: '4rem', fontWeight: 700 }}>
					GBL Notebook
				</li>
			</ul>
			<ul className="page-links">
				<li>
					<NavLink
						to="/"
						className={() => (notesIsActive ? 'current' : '')}
					>Notes</NavLink>
				</li>
				<li>
					<NavLink
						to="/settings"
						className={({ isActive }) => isActive ? "current" : ""}
					>Settings</NavLink>
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