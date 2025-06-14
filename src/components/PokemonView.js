import { useSelector } from 'react-redux'
import PokemonSprite from './PokemonSprite'
import { ArrowUp, ArrowDown, Edit, X } from '../images'
import { pokemonList, moveList } from '../store'

export default function PokemonView({
	pokemon,
	onEdit,
	onRemove,
	onMoveUp,
	onMoveDown,
	showStats,
	onDragEnter,
	onDragStart,
	onDragEnd
}) {
	const appData = useSelector((state) => state.appData)

	if (pokemon === null) {
		if (onEdit === null) {
			return <div className="team-placeholder">

			</div>
		}

		return <div className="team-placeholder editable"
			onClick={onEdit}>
			<PokemonSprite size="100" />
		</div>
	}

	if (typeof pokemon === 'number') {
		pokemon = appData.pokemon.find(({ id }) => id == pokemon)
	}

	const myPokemon = pokemonList.find(({ value }) => value == pokemon.templateId)
	const myFastMove = moveList.find(({ value }) => value == pokemon.fast)
	const myChargeMove1 = moveList.find(({ value }) => value == pokemon.charge1)
	const myChargeMove2 = pokemon['charge2']
		? moveList.find(({ value }) => value == pokemon.charge2)
		: null

	const getChargeMoveCount = (fastDelta, chargeDelta, format) => {
		const result = []
		let chargeBuffer = 0
		chargeDelta = Math.abs(chargeDelta)

		for (let i = 0; i < 4; i++) {
			const moveCount = Math.ceil(
				(chargeDelta - chargeBuffer) / fastDelta
			)
			result.push(moveCount)
			chargeBuffer = (moveCount * fastDelta) - chargeDelta + chargeBuffer
		}

		const formatters = {
			single: (counts) => {
				if (counts.every(value => value === counts[0])) {
					return counts[0]
				} else if (
					counts[0] === counts[1] &&
					counts[1] !== counts[2]
				) {
					return counts[0] + '.'
				} else {
					return counts[0] + '-'
				}

			},
			full: (counts) => counts.join(' - ')
		}

		return formatters[format](result)
	}

	return <div draggable onDragEnter={onDragEnter} onDragStart={onDragStart} onDragEnd={onDragEnd} className={'pokemon-type-box ' + myPokemon.types[0].toLowerCase()} >
		<div className={'flex-row pokemon-type-box-heading ' + myPokemon.types[0].toLowerCase()}>
			<h3>{
				typeof pokemon['name'] !== 'undefined' &&
					pokemon['name'] !== ''
					? pokemon.name
					: myPokemon.label
			}</h3>
			<div className="type-list">
				{myPokemon.types.map((type) =>
					<span
						key={type.toLowerCase()}
						className={'type_icon ' + type.toLowerCase()}>
					</span>
				)}
			</div>
		</div>
		<div className="pokemon-type-box-body flex-col">
			<div style={{ flexGrow: 0, display: 'flex', minWidth: '10rem', minHeight: '10rem', marginBottom: '1rem', position: 'relative' }}>
				{pokemon?.shadow && <img src={process.env.PUBLIC_URL + '/images/ic_shadow.png'} style={{ position: 'absolute', right: 0, bottom: 0 }} width="45" />}
				{pokemon?.purified && <img src={process.env.PUBLIC_URL + '/images/ic_purified.png'} style={{ position: 'absolute', right: 0, bottom: 0 }} width="45" />}
				<PokemonSprite
					size='100' pokemon={myPokemon} style={{ display: 'block', margin: '0 auto 1rem' }} />
			</div>
			<div style={{width: '100%'}}>
				{showStats && <div className={'flex-row'} style={{ margin: '1rem 0' }}>
					<div className="stats" style={{ whiteSpace: 'nowrap', lineHeight: '2.5rem' }}>{(pokemon?.cp) || '-'} CP</div>
					<div className="stats iv-list" style={{ textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '2.5rem' }}>
						<span>{(pokemon?.ivs?.atk) || '-'}<sup>Atk</sup></span>/
						<span>{(pokemon?.ivs?.def) || '-'}<sup>Def</sup></span>/
						<span>{(pokemon?.ivs?.sta) || '-'}<sup>Sta</sup></span>
					</div>
				</div>}
				<div>
					<p className="move_label">Fast Move</p>
					<p style={{ display: 'flex', marginBottom: '1rem' }}>
						<span style={{ flexGrow: 1 }} className={'move_type move_name ' + myFastMove.type.toLowerCase()}>{myFastMove.label}</span>
						<span className="move_count">{myFastMove.durationTurns}</span>
					</p>

					<p className="move_label">Charge Moves</p>
					<div className="flex-col">
						<p style={{ display: 'flex', marginBottom: '1rem' }}>
							<span style={{ flexGrow: 1 }} className={'move_type move_name ' + myChargeMove1.type.toLowerCase()}>{myChargeMove1.label}</span>
							<span className="move_count charge">{getChargeMoveCount(
								myFastMove.energyDelta,
								myChargeMove1.energyDelta,
								'single'
							)}</span>
						</p>
						{myChargeMove2 &&
							<p style={{ display: 'flex', marginBottom: '1rem' }}>
								<span style={{ flexGrow: 1 }} className={'move_type move_name ' + myChargeMove2.type.toLowerCase()}>{myChargeMove2.label}</span>
								<span className="move_count charge">{getChargeMoveCount(
									myFastMove.energyDelta,
									myChargeMove2.energyDelta,
									'single'
								)}</span>
							</p>
						}
					</div>
				</div>
			</div>
		</div>
		<div style={{ background: '#ececec', display: 'flex', gap: '1rem', padding: '.5rem 1rem', margin: '1rem -1rem 0 -1rem' }}>
			<button type="button" className="white-btn" onClick={onEdit}><Edit /></button>
			<button type="button" className="white-btn" onClick={onMoveUp}><ArrowUp /></button>
			<button type="button" className="white-btn" onClick={onMoveDown}><ArrowDown /></button>
			<button type="button" className="white-btn" onClick={onRemove}><X /></button>
		</div>
	</div>
}