import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Index() {
	/**
	 * The root path exists, but is not currently in use;
	 * redirect to /season for now
	 */
	const navigate = useNavigate()

	useEffect(() => {
		navigate('/season', {replace: true})
	})
}