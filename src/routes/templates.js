import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useOutletContext } from "react-router-dom"
import { pokemonList, updateTemplate, deleteTemplate } from '../store'
import StyledSelect from '../ui/StyledSelect'
import StyledSearch from '../ui/StyledSearch'
import styled from 'styled-components'
import PokemonView from '../components/PokemonView'
import PokemonEditor from '../components/PokemonEditor'
import useInfiniteScroll from '../lib/useInfiniteScroll'

const FilterContainer = styled.div`
	background: #fff;
	display: flex;
	padding: 1rem 0;
	box-shadow: -5px 0px 13px -7px #1c8696, 5px 0px 13px -7px #1c8696, 5px 5px 15px 5px rgba(0, 0, 0, 0);
	z-index: 3;
	& > div {
		margin-right: 1rem;
	}
	& > div:first-child {
		margin-left: auto;
	}
	& > div:last-child {
		margin-right: auto;
	}			
`

const ConfirmationBox = styled.div`
	display: flex;
	font-weight: 600;
	text-transform: uppercase;
	font-size: 1.4rem;
	border-radius: .5rem;
	color: #333;
`

export default function Templates() {
	const appData = useSelector((state) => state.appData)
	const useImages = appData.settings.images
	const dispatch = useDispatch()

	const [showModal] = useOutletContext()

	const typesByTemplateId = new Map(
		pokemonList.map(mon => [mon.templateId, mon.types])
	)
	const pokemonIdsByTemplateId = new Map(
		pokemonList.map(mon => [mon.templateId, mon.pokemonId])
	)	

	const [selectedCategory, setSelectedCategory] = useState('teamMember')
	const [selectedType, setSelectedType] = useState(null)
	const [searchName, setSearchName] = useState('')

	const getFilteredTemplates = () => {
		let filterTemplates = appData.templates.filter(
			template => (template.name !== undefined) === (selectedCategory === 'teamMember')
		)

		if (selectedType !== null)
			filterTemplates = filterTemplates.filter((template) => {
				const types = typesByTemplateId.get(template.templateId)
				return types?.includes(selectedType.value)
			})

		if (searchName != '') 
			filterTemplates = filterTemplates.filter((template) => {
				const pokemonId = pokemonIdsByTemplateId.get(template.templateId)
				return searchName && (
					template.name?.toLowerCase().startsWith(
						searchName.toLowerCase()
					) ||
					pokemonId.toLowerCase().startsWith(
						searchName.toLowerCase()
					)
				)
			})

		return filterTemplates
	}

	const showEditor = (withData) => {
		withData = {
			...withData,
			editType: selectedCategory,
			onSave: (data) => {
				dispatch(updateTemplate({
					originalName: data.originalName,
					updateWith: data.mon
				}))
				showModal(null)
			}
		}
		showModal(<PokemonEditor {...withData} />)
	}

	const handleDelete = (templateId, name) => {
		dispatch(deleteTemplate({ templateId, name }))
	}

	const [templates, setTemplates] = useState(getFilteredTemplates())
	const [displayLimit, setDisplayLimit] = useState(21)

	useEffect(() => {
		setTemplates(getFilteredTemplates())
	}, [appData.templates])

	useEffect(() => {
		setTemplates(getFilteredTemplates())
		setDisplayLimit(21)
	}, [selectedCategory, selectedType, searchName])

	const pokemonTypes = [
		{ value: "POKEMON_TYPE_NORMAL", label: "Normal" },
		{ value: "POKEMON_TYPE_FIRE", label: "Fire" },
		{ value: "POKEMON_TYPE_WATER", label: "Water" },
		{ value: "POKEMON_TYPE_ELECTRIC", label: "Electric" },
		{ value: "POKEMON_TYPE_GRASS", label: "Grass" },
		{ value: "POKEMON_TYPE_ICE", label: "Ice" },
		{ value: "POKEMON_TYPE_FIGHTING", label: "Fighting" },
		{ value: "POKEMON_TYPE_POISON", label: "Poison" },
		{ value: "POKEMON_TYPE_GROUND", label: "Ground" },
		{ value: "POKEMON_TYPE_FLYING", label: "Flying" },
		{ value: "POKEMON_TYPE_PSYCHIC", label: "Psychic" },
		{ value: "POKEMON_TYPE_BUG", label: "Bug" },
		{ value: "POKEMON_TYPE_ROCK", label: "Rock" },
		{ value: "POKEMON_TYPE_GHOST", label: "Ghost" },
		{ value: "POKEMON_TYPE_DRAGON", label: "Dragon" },
		{ value: "POKEMON_TYPE_DARK", label: "Dark" },
		{ value: "POKEMON_TYPE_STEEL", label: "Steel" },
		{ value: "POKEMON_TYPE_FAIRY", label: "Fairy" }
	]

	useInfiniteScroll({
		trackElement: '#display-limit',
		container: '#templates-data'
	}, () => {
		setDisplayLimit(prev => prev + 8)
	})

	return <div id="templates-wrapper">
		<FilterContainer>
			<div className="app-button-group selector">
				<button type="button"
					className={`app-like ${selectedCategory === 'teamMember' ? 'selected' : ''}`}
					onClick={() => setSelectedCategory('teamMember')}
				> My Pokemon
				</button>
				<button type="button"
					className={`app-like ${selectedCategory === 'opponent' ? 'selected' : ''}`}
					onClick={() => setSelectedCategory('opponent')}
				> Opponents
				</button>
			</div>
			<div style={{ width: '20rem' }}>
				<StyledSelect
					options={pokemonTypes}
					onChange={(type) => setSelectedType(type)}
					isClearable={true}
				/>
			</div>
			<StyledSearch
				onChange={(name) => setSearchName(name)}
			/>
		</FilterContainer>
		<div id="templates-data">
			{templates.length > 0 &&
				<section className="cup-section">
					<div className={`cup-section-body grid-list opponent-mons ${useImages ? 'with-images' : 'without-images'}`}>
						{templates.slice(0, displayLimit).map((mon, monIndex) =>
							<PokemonView
								key={'opponent_' + monIndex}
								pokemon={mon}
								showStats={selectedCategory === 'teamMember'}
								onEdit={() => showEditor({
									editData: { mon }
								})}
								onRemove={() => showModal(
									<ConfirmationBox>
										<div style={{ margin: 'auto 0' }}>
											<p>Are you sure?</p>
										</div>
										<div style={{ marginLeft: 'auto' }}>
											<button
												onClick={() => showModal(null)}
												className="outlined"
												style={{ marginRight: '1rem' }}
											>Cancel</button>
											<button
												onClick={() => {
													handleDelete(
														mon.templateId,
														mon?.name || null
													)
													showModal(null)
												}}
												className="filled warning"
											>Delete Template</button>
										</div>
									</ConfirmationBox>
								)}
								{...{ useImages }}
							/>
						)}
					</div>
				</section>
			}

			<div id="display-limit"></div>
		</div>
	</div >
}
