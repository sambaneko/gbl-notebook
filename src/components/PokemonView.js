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
		return <div className="pokemon-type-box team-placeholder"
			onClick={onEdit}>
			<PokemonSprite size="100" />
		</div>
	}

	if (typeof pokemon === 'number') {
		pokemon = appData.pokemon.find(({ id }) => id == pokemon)
	}

	const myPokemon = pokemonList.find(({ value }) => value == pokemon.templateId)
	const myFastMove = moveList.find(({ value }) => value == pokemon.fast.value)
	const myChargeMove1 = moveList.find(({ value }) => value == pokemon.charge1.value)
	const myChargeMove2 = pokemon['charge2']
		? moveList.find(({ value }) => value == pokemon.charge2.value)
		: null

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
		<div className="flex-col">
			<div style={{ flexGrow: 0, display: 'flex', minWidth: '10rem', minHeight: '10rem', marginBottom: '1rem', position: 'relative' }}>
				{pokemon?.shadow && <img src={process.env.PUBLIC_URL + '/images/ic_shadow.png'} style={{ position: 'absolute', right: 0, bottom: 0 }} width="45" />}
				{pokemon?.purified && <img src={process.env.PUBLIC_URL + '/images/ic_purified.png'} style={{ position: 'absolute', right: 0, bottom: 0 }} width="45" />}
				<PokemonSprite
					size='100' pokemon={myPokemon} style={{ display: 'block', margin: '0 auto 1rem' }} />
			</div>
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
				<span className={'move_type move_name ' + myFastMove.type.toLowerCase()}>{myFastMove.label}</span>

				<p className="move_label">Charge Moves</p>
				<div className="flex-col">
					<span className={'move_type move_name ' + myChargeMove1.type.toLowerCase()}>{myChargeMove1.label}</span>
					{myChargeMove2 &&
						<span className={'move_type move_name ' + myChargeMove2.type.toLowerCase()}>{myChargeMove2.label}</span>
					}
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