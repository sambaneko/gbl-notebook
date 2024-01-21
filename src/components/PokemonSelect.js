import Select, { components } from 'react-select'
import { pokemonList } from '../store'

export default function PokemonSelect({ onSelected, selectedCup, excludeList }) {
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

	const MenuList = ({ children, ...props }) => {
		return <components.MenuList {...props}>
			{Array.isArray(children)
				? children.slice(0, 5)
				: children
			}
		</components.MenuList>
	}

	const filterPokemonByCup = () => {
		let filteredOpts = [...pokemonList]

		if (selectedCup?.allowedTypes) {
			filteredOpts = filteredOpts.filter((mon) => {
				return (
					mon.types.filter(type => selectedCup.allowedTypes.includes(type))
				).length > 0
			})
		}

		if (selectedCup?.whiteList) {
			filteredOpts = filteredOpts.filter((mon) => {
				return selectedCup.whiteList.includes(mon.pokemonId) ||
					selectedCup.whiteList.includes(mon.pokemonId + ', ' + mon.form)
			})
		}

		if (selectedCup?.banList) {
			filteredOpts = filteredOpts.filter((mon) => {
				return !(
					selectedCup.banList.includes(mon.pokemonId) ||
					selectedCup.banList.includes(mon.pokemonId + ', ' + mon.form)
				)
			})
		}

		if (excludeList) {
			filteredOpts = filteredOpts.filter((mon) =>
				!excludeList.includes(mon.templateId)
			)
		}

		return filteredOpts
	}

	return <div>
		<label>Pokemon</label>
		<Select
			components={{ MenuList, Option }}
			options={filterPokemonByCup()}
			classNames={{
				option: ({ isDisabled, isFocused, isSelected }) =>
					isFocused ? 'isFocused' : ''
			}}
			onChange={onSelected}
			isDisabled={selectedCup === undefined}
		/* menuIsOpen={true} - helpful for debugging styles */
		/>
	</div>
}
