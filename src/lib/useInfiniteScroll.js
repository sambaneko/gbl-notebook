import { useLayoutEffect } from 'react'

export default function useInfiniteScroll({ trackElement, container }, callback) {
	useLayoutEffect(() => {
		const ele = document.querySelector(trackElement)
		const cont = container
			? document.querySelector(container)
			: window

		const handleScroll = () => {
			if (!ele) return

			const elePos = ele.getBoundingClientRect().y
			if (elePos <= window.innerHeight) {
				if (typeof callback === 'function') callback()
			}
		}

		cont.addEventListener('scroll', handleScroll, { passive: true })

		return () => cont.removeEventListener('scroll', handleScroll)
	})
}