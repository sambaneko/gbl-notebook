import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom"
import Select, { components } from 'react-select'
import { seasonList, leaguesList } from '../store'
import actions from '../actions/actions'
import TeamHolder from '../components/TeamHolder'
import TeamEditor from '../components/TeamEditor'
import TeamView from '../components/TeamView'
import OpponentsView from '../components/OpponentsView'
import PokemonEditor from '../components/PokemonEditor'

const actionHandler = new actions()

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
	actionHandler.provideDispatch(dispatch)

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

			let season = team !== null
				? seasonList.find(
					({ value }) => value === parseInt(team.season)
				)
				: latestSeason
			setCurrentSeason(season)

			actionHandler.updateContext({
				cup: selectedCup.templateId,
				season: season.value
			})
		}
	}, [cupData, latestSeason, selectedCup])

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
			actionHandler.doTeamAction(
				'update', editedMon
			)
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
				actionHandler.doOpponentAction(
					'update', { data: update }
				)
			} else {
				actionHandler.doTeamAction(
					'updateMember',
					{
						id: editedMon.teamId,
						memberIndex: editedMon.teamIndex,
						data: update
					}
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

	const SingleValue = ({ children, ...props }) => (
		<components.SingleValue {...props}>
			<div className="option-cup-name">{children}</div>
		</components.SingleValue>
	)

	return <div id="cup-wrapper">
		<div id="teams-wrapper">
			<div style={{ backgroundColor: '#7dd5aa', padding: '1rem' }}>
				<Select
					components={{ Option, SingleValue }}
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
				{...{ cupData, showEditor }}
				doAction={actionHandler.doTeamAction}
				currentSeason={appData.settings.season}
				useImages={appData.settings.images}
			/>
		</div>
		<div id="cup-data">
			{currentTeam !== null && <>
				<TeamView
					{...{ showEditor }}
					team={currentTeam}
					doAction={actionHandler.doTeamAction}
					useImages={appData.settings.images}
				/>
				<OpponentsView
					{...{ showEditor }}
					doAction={actionHandler.doOpponentAction}
					opponents={
						currentSeason && cupData
							? cupData.opponents.filter(
								({ season }) => season == currentSeason.value
							)
							: []
					}
					season={currentSeason?.value || null}
					useImages={appData.settings.images}
				/>
			</>}
		</div>
	</div>
}
