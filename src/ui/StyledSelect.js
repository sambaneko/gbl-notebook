import Select from 'react-select'

export default function StyledSelect(props) {
	const themeColor = '#3ABCA0'
	const textStyle = {
		color: themeColor,
		textTransform: 'uppercase'
	}

	return <Select
		{...props}
		styles={{
			control: (provided) => ({
				...provided,
				textTransform: 'uppercase',
				borderRadius: '3rem',
				borderColor: themeColor,
				borderWidth: '2px',
				textAlign: 'left',
				padding: '.5rem 1rem',
				'&:hover': {
					borderColor: '#44DABA'
				},
			}),
			option: (provided, state) => ({
				...provided,
				...textStyle,
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				cursor: 'pointer',
				padding: '1.4rem 2rem',
				textAlign: 'left',
				color: state.isSelected
					? '#fff'
					: (state.isFocused
						? '#104c55'
						: '#4C676A'
					),
				backgroundColor: state.isSelected
					? '#3883e4'
					: (state.isFocused
						? '#d9edf0'
						: '#fff'
					),
			}),
			singleValue: (provided, state) => ({
				...provided,
				...textStyle,
				fontWeight: 600,
			}),
			dropdownIndicator: (provided) => ({
				...provided,
				color: themeColor,
				svg: { fill: themeColor },
			}),
			placeholder: (provided) => ({
				...provided,
				...textStyle,
				fontWeight: 600,
			}),
		}}
	/>
}
