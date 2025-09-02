import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Index() {
	const appData = useSelector((state) => state.appData)
	const navigate = useNavigate()

	useEffect(() =>
		navigate(
			'/cup/' + (
				appData.lastViewed || 'great-league'
			), { replace: true }
		)
	)
}