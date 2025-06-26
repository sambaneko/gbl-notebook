import { useState } from 'react'
import { seasonList, pokemonList } from '../store'
import PokemonSprite from './PokemonSprite'
import { RoundedSquarePlus } from '../images'

export default function TeamHolder({ cupData, doAction, showEditor, currentSeason }) {
	const groupedTeams = cupData
		? Object.values(
			cupData.teams.reduce((acc, team) => {
				let season = team.season
				if (!acc[season]) {
					acc[season] = { season, teams: [] }
				}
				acc[season].teams.push(team)
				return acc
			}, {})
		).sort((a, b) => b.season - a.season)
		: []

	const currentGroup = groupedTeams.findIndex(obj =>
		obj.teams.some(team => team.id === cupData.current)
	)

	const [openGroups, setOpenGroups] = useState(
		currentGroup > -1 ? [currentGroup] : [0]
	)

	const toggleOpen = (groupIndex) => {
		let currentOpen = [...openGroups]
		const i = currentOpen.indexOf(groupIndex)

		if (i !== -1) currentOpen.splice(i, 1)
		else currentOpen.push(groupIndex)

		return currentOpen
	}

	return <div id="team-holder">
		<div className="teams-wrapper">
			<button
				className="app-like"
				onClick={() => showEditor({
					editType: 'team',
					editAction: 'add'
				})}
				style={{ width: '100%' }}
			>
				<RoundedSquarePlus /> New Team
			</button>

			{groupedTeams.map(
				(teamGroup, groupIndex) => <div
					key={groupIndex}
					className={'team-group' +
						(!openGroups.includes(groupIndex)
							? ' isClosed' : ''
						) +
						(teamGroup.season === currentSeason
							? ' current-season' : ''
						)
					}
				>
					<div
						className="team-group-season"
						onClick={() => setOpenGroups(
							toggleOpen(groupIndex)
						)}
					>
						{seasonList.find(
							({ value }) => value == teamGroup.season
						).label}
					</div>
					<div className="teams-wrapper-inner">
						{teamGroup.teams.map((team, teamIndex) =>
							<div
								key={teamIndex}
								className={
									'cup-team-box' +
									(team.id == cupData.current ? ' current' : '') +
									(team.fave ? ' fave-team' : '')
								}
								onClick={() => doAction('switch', { id: team.id })}
							>
								{Array.from({ length: 3 }).map(
									(m, i) => <div key={'team_' + teamIndex + '_mon_' + i} className="cup-team-mon">
										<PokemonSprite
											size="40"
											pokemon={
												team.mons[i]
													? pokemonList.find(({ value }) => value == team.mons[i].templateId)
													: null
											}
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	</div >
}
