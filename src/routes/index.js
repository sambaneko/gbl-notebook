import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Index() {
	/**
	 * The root path exists, but is not currently in use;
	 * redirect to /cup for now
	 */
	const navigate = useNavigate()
// temp
	useEffect(() => {
		navigate('/cup/spring-cup-great-league-edition', {replace: true})
	})
}