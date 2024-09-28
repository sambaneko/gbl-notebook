import PokemonSelect from './PokemonSelect'

export default function PokemonSelectFromCup({
	pokemon, onSelected, selectedCup, exclude, defaultValue
}) {
	const filterPokemonByCup = () => {
		let filteredOpts = [...pokemon]

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

		return filteredOpts
	}

	return <div>
		<label>Pokemon</label>
		<PokemonSelect
			pokemon={filterPokemonByCup()}
			{...{ onSelected, exclude, defaultValue }}
		/>
	</div>
}
