import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	seasonList,
	leaguesList,
	currentSeason,
	defaultCup,
	updatePokemon,
	removePokemon,
	rearrangePokemon
} from '../store'
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom"
import Select from 'react-select'

import TeamHolder from '../components/TeamHolder'
import TeamView from '../components/TeamView'
import OpponentsView from '../components/OpponentsView'
import PokemonEditor from '../components/PokemonEditor'

export function loader({ params }) {
	return {
		season: seasonList.find(
			(season) => {
				return isNaN(params.seasonId)
					? season.slug == params.seasonId
					: season.value == params.seasonId
			}
		) ?? null,
		cup: leaguesList.find(
			({ slug }) => slug === params.cupId
		) ?? null
	}
}

export default function Season() {
	const loaderData = useLoaderData()
	const selectedSeason = loaderData.season
	const selectedCup = loaderData.cup
	const [showModal] = useOutletContext()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const seasonCups = [
		...seasonList.find(({ value }) => value == 0).cups,
		...selectedSeason.cups
	]

	const appData = useSelector((state) => state.appData)

	if (appData['seasons'] === undefined) {
		appData.seasons = {}
	}

	if (selectedSeason !== null) {
		if (
			appData.seasons[selectedSeason.value] === undefined ||
			Object.keys(appData.seasons[selectedSeason.value]).length <= 0
		) {
			if (selectedCup !== null) {
				console.log('t1')
				appData.seasons[selectedSeason.value] = {
					cups: {
						[selectedCup.value]: { ...defaultCup }
					}
				}
			} else {
				console.log('t2')
				appData.seasons[selectedSeason.value] = { cups: {} }
			}
		}


	}

	const initCupData = () => {
		if (selectedSeason !== null && selectedCup !== null) {
			return appData.seasons[selectedSeason.value]?.cups[selectedCup.value]
				? { ...defaultCup, ...appData.seasons[selectedSeason.value].cups[selectedCup.value] }
				: defaultCup
		} else {
			return defaultCup
		}
	}

	const [cupData, setCupData] = useState(initCupData())

	useEffect(() => {
		setCupData(initCupData())
	}, [selectedSeason, selectedCup, appData.seasons])

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
			season: selectedSeason.value,
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
			season: selectedSeason.value,
			cup: selectedCup.templateId,
			monIndex,
			teamIndex
		}))
	}

	const moveMon = (monIndex, direction, teamIndex = null) => {
		dispatch(rearrangePokemon({
			season: selectedSeason.value,
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
					placeholder="Select Season"
					onChange={(selectedOpt) => {
						let path = '/season/' + selectedOpt.slug
						if (selectedCup != null) {
							if (
								selectedOpt.slug == 'all' ||
								selectedOpt.cups.includes(selectedCup.templateId) ||
								seasonList[0].cups.includes(selectedCup.templateId)
							) {
								path += '/' + selectedCup.slug
							}
						}
						navigate(path)
					}}
					defaultValue={selectedSeason ? selectedSeason : null}
				/>
			</div>
			<div key={selectedSeason.slug}>
				<Select
					options={
						selectedSeason.value == 0
							? leaguesList
							: leaguesList.filter(
								({ templateId }) => seasonCups.includes(templateId)
							)
					}
					styles={{
						control: (styles) => ({
							...styles,
							borderRadius: '3rem',
							padding: '.5rem 1rem'
						}),
						option: (styles) => ({ ...styles, padding: '2rem' })
					}}
					placeholder="Select Cup"
					onChange={(selectedOpt) => navigate('/season/' + selectedSeason.slug + '/' + selectedOpt.slug)}
					defaultValue={selectedCup ? selectedCup : null}
				/>
			</div>
		</div>
		<div id="cup-wrapper">
			<TeamHolder {...{ selectedCup, selectedSeason, cupData }} />
			<div id="cup-data">
				{(selectedSeason == null || selectedCup == null) && <>
					<h2>Welcome to GBL Notebook</h2>
					<p>Select a Season and Cup above to get started.</p>
				</>}
				{(selectedSeason && selectedCup) && <>
					<TeamView {...{ selectedCup, selectedSeason, cupData, setEditingPokemon, removeMon, moveMon, showModal }} />
					<OpponentsView {...{ selectedCup, selectedSeason, cupData, setEditingPokemon, removeMon, moveMon, showModal }} />
				</>}
			</div>
		</div>
	</>
}
