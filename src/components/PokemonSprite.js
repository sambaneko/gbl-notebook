import { Plus } from '../images'

export default function PokemonSprite({ pokemon, size, style }) {
	let myStyle = style ? { ...style } : {}

	if (pokemon) {
		let imageName = (
			pokemon['image']
				? pokemon['image']
				: 'pm' + pokemon.dexNumber + (
					pokemon['form'] && pokemon['form'] != 'NORMAL'
						? '.f' + pokemon.form.toUpperCase()
						: ''
				)
		) + (
				pokemon.shiny ? '.s' : ''
			) + '.icon.png'

		return <img
			className="pokemon-sprite"
			src={process.env.PUBLIC_URL + '/images/pokemon/' + imageName}
			alt=''
			style={myStyle}
			onError={({ currentTarget }) => {
				currentTarget.onerror = null
				currentTarget.src = process.env.PUBLIC_URL + '/images/altmons/' + pokemon.types[0].toLowerCase() + '.png'
			}}
		/>
	}

	let xStyle = {
		textAlign: 'center',
		display: 'inline-block',
		width: '100%',
		position: 'relative',
		margin: 'auto',
		color: '#ececec'
	}

	xStyle.width = size ? size + 'px' : '100px'
	xStyle.height = size ? size + 'px' : '100px'

	return <span style={xStyle}><Plus style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} /></span>
}
