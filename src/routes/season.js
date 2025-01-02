import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	seasonList,
	leaguesList,
	updateTeamMember,
	updateTemplate
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
		) ?? seasonList[1],
		cup: leaguesList.find(
			({ slug }) => slug === params.cupId
		) ?? null
	}
}

export default function Season() {
	const loaderData = useLoaderData()
	const navigate = useNavigate()
	const [showModal] = useOutletContext()
	const dispatch = useDispatch()

	const selectedSeason = loaderData.season
	const selectedCup = loaderData.cup
	const appData = useSelector((state) => state.appData)

	const seasonCups = [
		...seasonList.find(({ value }) => value == 0).cups,
		...selectedSeason.cups
	]

	const getCurrentTeamId = () => appData.current.find(
		({ cup, season }) =>
			cup == (
				selectedCup === null
					? null : selectedCup.templateId
			) &&
			season == (
				selectedSeason === null
					? null : selectedSeason.value
			)
	)?.id || null

	const [currentTeamId, setCurrentTeamId] = useState(getCurrentTeamId())

	const getPreviousSeason = () => {
		if (
			selectedCup !== null &&
			appData.opponents.length > 0
		) {
			let previousSeasons = (
				appData.opponents.map(
					({ cup, season }) => cup == selectedCup.templateId
						? season : 0
				)
			).sort((a, b) => b - a)

			return previousSeasons[0]
		} else return 0;
	}

	const [previousSeason, setPreviousSeason] = useState(getPreviousSeason())

	useEffect(() => {
		setCurrentTeamId(getCurrentTeamId())
		setPreviousSeason(getPreviousSeason())
	}, [selectedSeason, selectedCup, appData.current])

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
		console.log(editedMon)
		dispatch(
			updateTeamMember({
				id: editingPokemon.id,
				teamIndex: editingPokemon.teamIndex,
				team: {
					season: selectedSeason.value,
					cup: selectedCup.templateId
				},
				pokemon: editedMon
			})
		)
		if (saveTemplate) {
			dispatch(
				updateTemplate({
					templateIndex, pokemon: editedMon
				})
			)
		}
		setEditingPokemon(null)
		showModal(null)
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
			<TeamHolder
				teams={
					appData.teams.filter(
						({ cup, season }) =>
							(
								selectedCup !== null
									? cup == selectedCup.templateId
									: false
							) && (
								selectedSeason.slug == 'all' ||
								season == selectedSeason.value
							)
					)
				}
				current={
					appData.current.find(
						({ cup, season }) =>
							(cup == selectedCup?.templateId || false) &&
							season == selectedSeason.value
					)?.id || null
				}
				faves={appData.faves}
				season={selectedSeason !== null ? selectedSeason.value : null}
				cup={selectedCup?.templateId || null}
			/>
			<div id="cup-data">
				{(selectedSeason == null || selectedCup == null) && <>
					<h2>Welcome to GBL Notebook</h2>
					<p>Select a Season and Cup above to get started.</p>
				</>}
				{currentTeamId !== null && <>
					<TeamView
						{...{ setEditingPokemon, showModal }}
						season={selectedSeason !== null ? selectedSeason.value : null}
						team={appData.teams.find(
							({ id }) => id == currentTeamId
						)}
						fave={appData.faves.find(
							({ id }) => id == currentTeamId
						) !== undefined}
					/>
					{selectedSeason.slug != 'all'
						? <OpponentsView
							{...{ selectedCup, setEditingPokemon, showModal, previousSeason }}
							opponents={
								appData.opponents.filter(
									({ cup, season }) => cup == selectedCup.templateId && season == selectedSeason.value
								)
							}
							season={selectedSeason?.value || null}
							cup={selectedCup?.templateId || null}
						/>
						: <div className="notice-box">
							Select a season to view Opponents
						</div>
					}
				</>}
			</div>
		</div>
	</>
}
