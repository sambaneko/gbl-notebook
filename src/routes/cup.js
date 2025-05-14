import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	seasonList,
	leaguesList,
	updateTeam,
	deleteTeam,
	updateTeamMember,
	moveTeamMember,
	removeTeamMember,
	updateTemplates,
	updateCurrent,
	updateOpponent,
	moveOpponent,
	removeOpponent,
	importOpponents
} from '../store'
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom"
import Select, { components } from 'react-select'

import TeamHolder from '../components/TeamHolder'
import TeamEditor from '../components/TeamEditor'
import TeamView from '../components/TeamView'
import OpponentsView from '../components/OpponentsView'
import PokemonEditor from '../components/PokemonEditor'

export function loader({ params }) {
	return leaguesList.find(
		({ slug }) => slug === params.cupId
	) ?? null
}

export default function Cup() {
	const selectedCup = useLoaderData()
	const navigate = useNavigate()

	const appData = useSelector((state) => state.appData)
	const dispatch = useDispatch()

	const [showModal] = useOutletContext()

	const cupData = (
		selectedCup !== null &&
		appData.cups[selectedCup.templateId]
	)
		? appData.cups[selectedCup.templateId]
		: null

	const latestSeason = seasonList.reduce(
		(max, season) => season.value > max.value
			? season
			: max, seasonList[0]
	)

	const [currentTeam, setCurrentTeam] = useState(null)
	const [currentSeason, setCurrentSeason] = useState(null)

	useEffect(() => {
		if (cupData !== null) {
			let team = cupData.current !== null
				? cupData.teams.find(({ id }) => id === cupData.current)
				: null
			setCurrentTeam(team)

			setCurrentSeason(
				team !== null
					? seasonList.find(({ value }) => value == team.season)
					: latestSeason
			)
		}
	}, [cupData, latestSeason])

	const sortedLeagues = leaguesList.sort((a, b) => {
		if (
			latestSeason.cups.includes(a.templateId) &&
			!latestSeason.cups.includes(b.templateId)
		) {
			return -1
		} else if (
			!latestSeason.cups.includes(a.templateId) &&
			latestSeason.cups.includes(b.templateId)
		) {
			return 1
		} else {
			if (a.label < b.label) return -1
			else if (a.label > b.label) return 1
			else return 0
		}
	})

	const teamActions = {
		update: (data) => {
			dispatch(
				updateTeam({
					cup: selectedCup.templateId,
					team: data.team
				})
			)

			if (data.templates !== undefined)
				dispatch(
					updateTemplates(data.templates)
				)

			if (data.team.id === undefined)
				teamActions.switch(null)
		},
		delete: (id) => dispatch(
			deleteTeam({
				cup: selectedCup.templateId, id
			})
		),
		switch: (id) => {
			dispatch(
				updateCurrent({
					cup: selectedCup.templateId, id
				})
			)
		},
		updateMember: (id, memberIndex, data) => {
			dispatch(
				updateTeamMember({
					id, memberIndex,
					member: data.member,
					cup: selectedCup.templateId,
					season: currentSeason.value
				})
			)

			if (data.templates.length)
				dispatch(
					updateTemplates(data.templates)
				)
		},
		moveMember: (id, memberIndex, dir) => dispatch(
			moveTeamMember({
				cup: selectedCup.templateId,
				id, memberIndex, dir
			})
		),
		removeMember: (id, memberIndex) => dispatch(
			removeTeamMember({
				cup: selectedCup.templateId,
				id, memberIndex
			})
		)
	}

	const opponentActions = {
		update: (data) => {
			dispatch(
				updateOpponent({
					member: data.member,
					cup: selectedCup.templateId,
					season: currentSeason.value
				})
			)

			if (data.templates !== undefined)
				dispatch(
					updateTemplates(data.templates)
				)
		},
		move: (id, dir) => dispatch(
			moveOpponent({
				cup: selectedCup.templateId,
				season: currentSeason.value,
				id, dir
			})
		),
		remove: (id) => dispatch(
			removeOpponent({
				cup: selectedCup.templateId, id
			})
		),
		import: () => dispatch(
			importOpponents({
				cup: selectedCup.templateId,
				season: currentSeason.value
			})
		)
	}

	const showEditor = (withData) => {
		withData = {
			...withData,
			withCup: selectedCup,
			onSave: (data) => saveEditedPokemon(data)
		}
		showModal(
			withData.editType === 'team'
				? <TeamEditor {...withData} />
				: <PokemonEditor {...withData} />
		)
	}

	const saveEditedPokemon = (editedMon) => {
		if (editedMon.editType === 'team') {
			teamActions.update(editedMon)
			showModal(null)
		} else {
			let update = { member: editedMon.mon }

			if (
				editedMon.template.create ||
				editedMon.template.update
			)
				update.templates = {
					templateIndex: (
						editedMon.template.update
							? editedMon.template.using
							: null
					),
					pokemon: editedMon.mon
				}

			if (editedMon.editType === 'opponent') {
				opponentActions.update(update)
			} else {
				teamActions.updateMember(
					editedMon.teamId,
					editedMon.teamIndex,
					update
				)
				showModal(null)
			}
		}
	}

	const Option = (props) => {
		return <div className={
			latestSeason.cups.includes(props.data.templateId)
				? 'current-season-cup' : ''
		}>
			<components.Option {...props} />
		</div>
	}

	return <div id="cup-wrapper">
		<div>
			<div style={{ backgroundColor: '#7dd5aa', padding: '1rem' }}>
				<Select
					components={{ Option }}
					options={sortedLeagues}
					styles={{
						control: (styles) => ({
							...styles,
							borderRadius: '3rem',
							padding: '.5rem 1rem'
						}),
						option: (styles) => ({ ...styles, padding: '2rem' })
					}}
					placeholder="Select Cup"
					onChange={(selectedOpt) => navigate(
						'/cup/' + selectedOpt.slug
					)}
					defaultValue={selectedCup}
				/>
			</div>
			<TeamHolder
				{...{
					cupData,
					teamActions,
					showEditor
				}}
			/>
		</div>
		<div id="cup-data">
			{currentTeam !== null && <>
				<TeamView
					{...{
						showEditor,
						teamActions
					}}
					team={currentTeam}
				/>
				<OpponentsView
					{...{
						showEditor,
						opponentActions
					}}
					opponents={
						currentSeason
							? cupData.opponents.filter(
								({ season }) => season == currentSeason.value
							)
							: []
					}
					season={currentSeason?.value || null}
				/>
			</>}
		</div>
	</div>
}
