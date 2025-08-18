import { Plus } from '../images'
import { useSelector } from 'react-redux'

export default function PokemonSprite({ pokemon, size, style }) {
	const appData = useSelector((state) => state.appData)

	let myStyle = style ? { ...style } : {}
	let imgPath = appData.settings.imagesPath 
		?? process.env.PUBLIC_URL + '/images/pokemon'

	if (pokemon) {
		let imageName = (
			pokemon['image']
				? pokemon['image']
				: 'pm' + pokemon.dexNumber + (
					pokemon['shortForm'] && pokemon['shortForm'] != 'NORMAL'
						? '.f' + pokemon.shortForm.toUpperCase()
						: ''
				)
		) + (
				pokemon.shiny ? '.s' : ''
			) + '.icon.png'

		return <img
			className="pokemon-sprite"
			src={imgPath + '/' + imageName}
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
