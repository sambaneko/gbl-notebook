import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Index() {
	const appData = useSelector((state) => state.appData)
	const navigate = useNavigate()

	useEffect(() => {
		if (appData.lastViewed !== null)
			navigate(`/cup/${appData.lastViewed}`, {replace: true})
		else // temp
			navigate(`/cup/spring-cup-great-league-edition`, {replace: true})
	})
}