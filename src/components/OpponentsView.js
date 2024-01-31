import { useDispatch } from 'react-redux'
import { addOpponent } from '../store'
import PokemonView from './PokemonView'
import PokemonEditor from '../components/PokemonEditor'

export default function OpponentsView({ selectedCup, cupData, showModal, setEditingPokemon, removeMon, moveMon }) {
	const dispatch = useDispatch()

	const saveOpponent = (opponent) => {
		dispatch(addOpponent({
			cup: selectedCup.templateId,
			opponent
		}))
	}

	return <section className="cup-section">
		<div className="cup-section-head">
			<div className="flex flex-grow">
				<h2 className="flex-v-center">Notable Opponents</h2>
			</div>
			<button type="button"
				className="app-like"
				onClick={() =>
					showModal(<PokemonEditor
						pokemon={null}
						onSave={(opponent) => saveOpponent(opponent)}
						enableStats={false}
						selectedCup={selectedCup}
					/>)
				}
			> Add
			</button>
		</div>
		{cupData.opponents.length > 0 &&
			<div className="cup-section-body grid-list">
				{cupData.opponents.map((mon, monIndex) =>
					<PokemonView
						key={'opponent_' + monIndex}
						pokemon={mon}
						showStats={false}
						onEdit={() => setEditingPokemon({ teamIndex: null, mon, monIndex, stats: false })}
						onRemove={() => removeMon(monIndex)}
						onMoveUp={() => {
							if (monIndex >= 1) {
								moveMon(monIndex, -1)
							}
						}}
						onMoveDown={() => {
							if (monIndex < cupData['opponents'].length - 1) {
								moveMon(monIndex, 1)
							}
						}}
					/>
				)}
			</div>
		}
	</section>
}
