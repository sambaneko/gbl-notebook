import { useRef } from 'react'
import PokemonView from './PokemonView'
import { RoundedSquarePlus } from '../images'

export default function OpponentsView({
	opponents,
	doAction,
	showEditor,
	season,
	useImages
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

	return <>
		<div className="section-head flex">
			<div className="flex-grow">
				<h1>Opponents</h1>
			</div>
			<div className="app-button-group">
				<button type="button"
					className="app-like"
					onClick={() => doAction('import')}
				> <RoundedSquarePlus /> Previous
				</button>
				<button type="button"
					className="app-like"
					onClick={() => showEditor({ editType: 'opponent' })}
				> <RoundedSquarePlus /> Opponent
				</button>
			</div>
		</div>
		{opponents.length > 0 &&
			<section className="cup-section">
				<div className={`cup-section-body grid-list opponent-mons ${useImages ? 'with-images' : 'without-images'}`}>
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
							{...{ useImages }}
						/>
					)}
				</div>
			</section>
		}
	</>
}
