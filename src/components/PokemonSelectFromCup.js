import PokemonSelect from './PokemonSelect'

export default function PokemonSelectFromCup({
	pokemon,
	selectedCup,
	exclude,
	...otherProps
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
				let whiteList = selectedCup.whiteList
				let banList = selectedCup?.banList || []

				return whiteList.includes(mon.pokemonId) ||
					(
						mon.shortForm
							? (
								whiteList.includes(
									mon.pokemonId + ', ' + mon.shortForm
								) &&
								!banList.includes(
									mon.pokemonId + ', ' + mon.shortForm
								)
							)
							: false
					)
			})
		}

		if (selectedCup?.banList) {
			filteredOpts = filteredOpts.filter((mon) => {
				return !(
					selectedCup.banList.includes(mon.pokemonId) ||
					(
						mon.shortForm
							? selectedCup.banList.includes(mon.pokemonId + ', ' + mon.shortForm)
							: false
					)
				)
			})
		}

		return filteredOpts
	}

	if (!selectedCup.unique) exclude = []

	return <div>
		<label>Pokemon</label>
		<PokemonSelect
			pokemon={filterPokemonByCup()}
			{...{ exclude, ...otherProps }}
		/>
	</div>
}
