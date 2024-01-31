import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom"
import {
	leagues,
	defaultCup,
	updatePokemon,
	removePokemon,
	rearrangePokemon
} from '../store'
import Select from 'react-select'

import TeamHolder from '../components/TeamHolder'
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
		return selectedCup !== null && appData[selectedCup.value]
			? { ...defaultCup, ...appData[selectedCup.value] }
			: defaultCup
	}

	const [cupData, setCupData] = useState(initCupData())

	useEffect(() => {
		setCupData(initCupData())
	}, [appData, selectedCup])

	const [editingPokemon, setEditingPokemon] = useState()

	useEffect(() => {
		editingPokemon && showModal(
			<PokemonEditor
				pokemon={editingPokemon.mon}
				onSave={(editedMon) => saveEditedPokemon(editedMon)}
				enableStats={editingPokemon.stats}
				selectedCup={selectedCup}
			/>
		)
	}, [editingPokemon])

	const saveEditedPokemon = (editedMon) => {
		dispatch(updatePokemon({
			cup: selectedCup.templateId,
			monIndex: editingPokemon.monIndex,
			teamIndex: editingPokemon.teamIndex,
			pokemon: editedMon
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
		<div id="cup-wrapper">
			<TeamHolder {...{ selectedCup, cupData }} />
			<div id="cup-data">
				{selectedCup === null && <>
					<h2>Welcome to GBL Notebook</h2>
					<p>Select a cup from the list above to get started.</p>
				</>}
				{selectedCup && <>
					<TeamView {...{ selectedCup, cupData, setEditingPokemon, removeMon, moveMon }} />
					<OpponentsView {...{ selectedCup, cupData, setEditingPokemon, removeMon, moveMon, showModal }} />
				</>}
			</div>
		</div>
	</>
}
