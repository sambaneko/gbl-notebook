import Select, { components } from 'react-select'

export default function PokemonSelect({
	pokemon,
	exclude,
	isInvalid,
	...otherProps
}) {
	const Option = (props) => {
		return <div className={'pokemon_option pokemon_type ' + props.data.types[0].toLowerCase()}>
			<div className="type-list">
				{
					props.data.types.map((type) =>
						<span
							key={type.toLowerCase()}
							className={'type_icon ' + type.toLowerCase()}>
						</span>
					)
				}
			</div>
			<components.Option {...props} />
		</div>
	}

	const MenuList = ({ children, selectProps, ...props }) => {
		const { inputValue } = selectProps

		return (
			<components.MenuList {...props}>
				{Array.isArray(children)
					? inputValue.length >= 3
						? children
						: children.slice(0, 5)
					: children
				}
			</components.MenuList>
		)
	}

	const filterPokemon = () => {
		let filteredOpts = [...pokemon]

		if (exclude) {
			filteredOpts = filteredOpts.filter((mon) =>
				!exclude.includes(mon.templateId)
			)
		}

		return filteredOpts
	}

	return <Select
		components={{ MenuList, Option }}
		options={filterPokemon()}
		classNames={{
			control: (state) => isInvalid ? 'invalidField' : '',
			option: ({ isDisabled, isFocused, isSelected }) =>
				isFocused ? 'isFocused' : ''
		}}
		{...otherProps}
	/* menuIsOpen={true} - helpful for debugging styles */
	/>
}
