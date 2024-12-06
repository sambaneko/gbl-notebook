import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateOpponent, updateTemplate, moveOpponent, removeOpponent, importOpponents } from '../store'
import PokemonView from './PokemonView'
import PokemonEditor from '../components/PokemonEditor'

export default function OpponentsView({ showModal, opponents, season, cup, selectedCup, previousSeason }) {
	const dispatch = useDispatch()

	const saveEditedPokemon = (editedMon, saveTemplate, templateIndex, id) => {
		dispatch(
			updateOpponent({
				id,
				...editedMon,
				cup,
				season
			})
		)
		if (saveTemplate) {
			dispatch(
				updateTemplate({
					templateIndex, pokemon: editedMon
				})
			)
		}
	}

	let dragging = useRef()
	let draggingOver = useRef()
	let draggingId = null

	const dragStart = (id, index) => {
		dragging.current = index
		draggingId = id
	}

	const dragEnter = (index) => {
		draggingOver.current = index
	}

	const dragEnd = () => {
		moveMon(
			draggingId,
			draggingOver.current - dragging.current
		)
		draggingId = null
	}

	const moveMon = (id, dir) => {
		dispatch(
			moveOpponent({
				season, cup, id, dir
			})
		)
	}

	return <section className="cup-section">
		<div className="cup-section-head">
			<div className="flex flex-grow">
				<h2 className="flex-v-center">Notable Opponents</h2>
			</div>
			<button type="button"
				className="app-like"
				onClick={() =>					
					dispatch( /** todo: this should have a confirmation */
						importOpponents({
							previousSeason, season, cup
						})
					)
				}
				style={{ marginRight: '1rem' }}
			> Import Previous
			</button>
			<button type="button"
				className="app-like"
				onClick={() =>
					showModal(
						<PokemonEditor
							editType="opponent"
							pokemon={null}
							onSave={(
								editedMon, saveTemplate, templateIndex
							) => saveEditedPokemon(
								editedMon, saveTemplate, templateIndex, null
							)}
							selectedCup={selectedCup}
						/>
					)
				}
			> Add
			</button>
		</div>
		{opponents.length > 0 &&
			<div className="cup-section-body grid-list">
				{opponents.map((mon, monIndex) =>
					<PokemonView
						key={'opponent_' + monIndex}
						pokemon={mon}
						showStats={false}
						onEdit={() =>
							showModal(
								<PokemonEditor
									editType="opponent"
									pokemon={mon}
									onSave={(
										editedMon, saveTemplate, templateIndex
									) => {
										saveEditedPokemon(
											editedMon, saveTemplate, templateIndex, mon?.id || null
										)
										showModal(null)
									}}
									selectedCup={selectedCup}
								/>
							)
						}
						onRemove={() => dispatch(removeOpponent(mon.id))}
						onMoveUp={() => monIndex > 0 && moveMon(mon.id, -1)}
						onMoveDown={() => monIndex < opponents.length - 1 && moveMon(mon.id, 1)}
						onDragStart={e => dragStart(mon.id, monIndex)}
						onDragEnter={e => dragEnter(monIndex)}
						onDragEnd={e => dragEnd()}
					/>
				)}
			</div>
		}
	</section>
}
