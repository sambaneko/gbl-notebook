import { useRef } from 'react'
import PokemonView from './PokemonView'

export default function OpponentsView({
	opponents,
	doAction,
	showEditor,
	season
}) {
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
		doAction('move', {
			id: draggingId,
			dir: draggingOver.current - dragging.current
		})
		draggingId = null
	}

	return <section className="cup-section">
		<div className="cup-section-head">
			<div className="flex flex-grow">
				<h2 className="flex-v-center">Opponents - Season {season}</h2>
			</div>
			<button type="button"
				className="app-like"
				onClick={() => doAction('import')}
				style={{ marginRight: '1rem' }}
			> Import Previous
			</button>
			<button type="button"
				className="app-like"
				onClick={() => showEditor({ editType: 'opponent' })}
			> Add
			</button>
		</div>
		{
			opponents.length > 0 &&
			<div className="cup-section-body grid-list">
				{opponents.map((mon, monIndex) =>
					<PokemonView
						key={'opponent_' + monIndex}
						pokemon={mon}
						showStats={false}
						onEdit={() => showEditor({
							editType: 'opponent',
							editData: { mon }
						})}
						onRemove={() => doAction('remove', { id: mon.id })}
						onMoveUp={() => monIndex > 0 &&
							doAction('move', { id: mon.id, dir: -1 })
						}
						onMoveDown={() => monIndex < opponents.length - 1 &&
							doAction('move', { id: mon.id, dir: 1 })
						}
						onDragStart={e => dragStart(mon.id, monIndex)}
						onDragEnter={e => dragEnter(monIndex)}
						onDragEnd={e => dragEnd()}
					/>
				)}
			</div>
		}
	</section >
}
