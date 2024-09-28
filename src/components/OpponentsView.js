import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updatePokemon } from '../store'
import PokemonView from './PokemonView'
import PokemonEditor from '../components/PokemonEditor'

export default function OpponentsView({ selectedCup, selectedSeason, cupData, showModal, setEditingPokemon, removeMon, moveMon }) {
	const dispatch = useDispatch()

	const saveEditedPokemon = (editedMon, saveTemplate, templateIndex) => {
		dispatch(updatePokemon({
			cup: selectedCup.templateId,
			monIndex: null,
			teamIndex: null,
			pokemon: editedMon,
			saveTemplate,
			templateIndex,
			season: selectedSeason.value
		}))
	}

	let todoItemDrag = useRef()
	let todoItemDragOver = useRef()

	const dragStart = (e, index) => {
		todoItemDrag.current = index
	}

	const dragEnter = (e, index) => {
		todoItemDragOver.current = index
	}

	const dragEnd = (e, index) => {
		let moveBy = todoItemDragOver.current - todoItemDrag.current
		if (moveBy !== 0) {
			moveMon(todoItemDrag.current, moveBy)
		}
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
						editType="oppo"
						pokemon={null}
						onSave={(
							editedMon, saveTemplate, templateIndex
						) => saveEditedPokemon(
							editedMon, saveTemplate, templateIndex
						)}
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
						onEdit={() => setEditingPokemon({ teamIndex: null, mon, monIndex, stats: false, editType: 'oppo' })}
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
						onDragStart={e => dragStart(e, monIndex)}
						onDragEnter={e => dragEnter(e, monIndex)}
						onDragEnd={e => dragEnd(e, monIndex)}
					/>
				)}
			</div>
		}
	</section>
}
