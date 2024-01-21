import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import X from '../images/X'

export default function Modal({ onClose, closeOnBgClick, children }) {
	const modalRef = useRef(null)
	const closeOnBg = closeOnBgClick ? closeOnBgClick : false

	const handleClose = () => {
		const modalElement = modalRef.current
		modalElement.close()
		if (onClose) {
			onClose()
		}
	}

	useEffect(() => {
		const modalElement = modalRef.current

		if (modalElement) {
			modalElement.showModal()
			if (closeOnBg) {
				modalElement.addEventListener('click', function (event) {
					let rect = modalElement.getBoundingClientRect()
					if (
						!(
							rect.top <= event.clientY &&
							event.clientY <= rect.top + rect.height &&
							rect.left <= event.clientX &&
							event.clientX <= rect.left + rect.width
						)
					) {
						handleClose()
					}
				})
			}
		}
	})

	const Dialog = styled.dialog`
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
		overflow: visible;
		&::backdrop {
			background: hsl(0 0% 0% / 50%);
		}	  
	`

	const Close = styled.div`
		background: #fff;
		border-radius: 3rem;
		width: 4rem;
  		height: 4rem;
		display: flex;
		box-shadow: hsl(0 0% 0% / 30%) 0 0 0.5rem 0.25rem;
		margin: -4rem auto 0 auto;
		position: relative;
		bottom: -8rem;
		cursor: pointer;
		&> svg {
			margin: auto;
		}
	`

	return (
		<Dialog ref={modalRef}>
			{children}
			<Close onClick={() => handleClose()}><X /></Close>
		</Dialog>
	)
}
