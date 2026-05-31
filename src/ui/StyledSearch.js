import { useState, useEffect } from 'react'
import { Search } from '../images'
import styled from 'styled-components'

const SearchContainer = styled.div`
	display: flex;
	border: 2px solid #3ABCA0;
	border-radius: 3rem;
	&:focus-within {
		outline: 5px auto Highlight;
		outline: 5px auto -webkit-focus-ring-color;
	}
`
export default function StyledSearch(props) {
	const [inputValue, setInputValue] = useState('')
	const [debouncedValue, setDebouncedValue] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(inputValue), 500)
		return () => clearTimeout(timer)
	}, [inputValue])

	useEffect(() => {
		if (props.onChange) props.onChange(debouncedValue)
	}, [debouncedValue])

	return <SearchContainer>
		<input
			{...props}
			type="text"
			style={{
				padding: '1rem 1.5rem',
				marginRight: '1rem',
				border: 'none',
				borderRadius: '3rem',
				outline: 'none'
			}}
			value={inputValue}
			onChange={(e) => setInputValue(e.target.value)}
		/>
		<div
			className="search-svg"
			style={{
				color: '#3ABCA0',
				margin: 'auto 1rem auto auto'
			}}
		>
			<Search />
		</div>
	</SearchContainer>
}