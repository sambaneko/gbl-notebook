import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom"
import {
	leagues,
	defaultCup,
	updatePokemon,
	removePokemon,
	rearrangePokemon,
	seasonList,
	currentSeason
} from '../store'
import Select from 'react-select'

import TeamHolderCups from '../components/TeamHolderCups'
import TeamView from '../components/TeamView'
import OpponentsView from '../components/OpponentsView'
import PokemonEditor from '../components/PokemonEditor'

export function loader({ params }) {
	return leagues.find(({ slug }) => slug === params.cupId) ?? null
}

export default function Cups() {
	const selectedCup = useLoaderData()
	const [showModal] = useOutletContext()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const appData = useSelector((state) => state.appData)

	const initCupData = () => {
		return selectedCup !== null && appData.cups[selectedCup.value]
			? { ...defaultCup, ...appData.cups[selectedCup.value] }
			: defaultCup
	}

	const [cupData, setCupData] = useState(initCupData())

	const [selectedSeason, setSelectedSeason] = useState(
		seasonList.find(({ value }) => value == currentSeason)
	)

	useEffect(() => {
		setCupData(initCupData())
	}, [appData.cups, selectedCup])

	const [editingPokemon, setEditingPokemon] = useState()

	useEffect(() => {
		editingPokemon && showModal(
			<PokemonEditor
				editType={editingPokemon.editType}
				pokemon={editingPokemon.mon}
				onSave={(
					editedMon, saveTemplate, templateIndex
				) => saveEditedPokemon(
					editedMon, saveTemplate, templateIndex
				)}
				selectedCup={selectedCup}
				excludeList={editingPokemon.exclude}
			/>
		)
	}, [editingPokemon])

	const saveEditedPokemon = (editedMon, saveTemplate, templateIndex) => {
		dispatch(updatePokemon({
			cup: selectedCup.templateId,
			monIndex: editingPokemon.monIndex,
			teamIndex: editingPokemon.teamIndex,
			pokemon: editedMon,
			saveTemplate,
			templateIndex
		}))
		setEditingPokemon(null)
		showModal(null)
	}

	const removeMon = (monIndex, teamIndex = null) => {
		dispatch(removePokemon({
			cup: selectedCup.templateId,
			monIndex,
			teamIndex
		}))
	}

	const moveMon = (monIndex, direction, teamIndex = null) => {
		dispatch(rearrangePokemon({
			cup: selectedCup.templateId,
			monIndex,
			direction,
			teamIndex
		}))
	}

	return <>
		<div id="cup-select">
			<div style={{ minWidth: '26rem', boxSizing: 'border-box', flexGrow: 0 }}>
				<Select
					options={seasonList}
					styles={{
						control: (styles) => ({
							...styles,
							borderRadius: '3rem',
							padding: '.5rem 1rem'
						}),
						option: (styles) => ({ ...styles, padding: '2rem' })
					}}
					onChange={(selectedOpt) => setSelectedSeason(selectedOpt)}
					defaultValue={selectedSeason ? selectedSeason : null}
				/>
			</div>
			<div>
				<Select
					options={leagues}
					styles={{
						control: (styles) => ({
							...styles,
							borderRadius: '3rem',
							padding: '.5rem 1rem'
						}),
						option: (styles) => ({ ...styles, padding: '2rem' })
					}}
					placeholder="Select Cup"
					onChange={(selectedOpt) => navigate('/cups/' + selectedOpt.slug)}
					defaultValue={selectedCup ? selectedCup : null}
				/>
			</div>
		</div>
		<div id="cup-wrapper">
			<TeamHolderCups {...{ selectedCup, selectedSeason, cupData }} />
			<div id="cup-data">
				{selectedCup === null && <>
					<h2>Welcome to GBL Notebook</h2>
					<p>Select a cup from the list above to get started.</p>
				</>}
				{selectedCup && <>
					<TeamView {...{ selectedCup, selectedSeason, cupData, setEditingPokemon, removeMon, moveMon, showModal }} />
					<OpponentsView {...{ selectedCup, selectedSeason, cupData, setEditingPokemon, removeMon, moveMon, showModal }} />
				</>}
			</div>
		</div>
	</>
}
