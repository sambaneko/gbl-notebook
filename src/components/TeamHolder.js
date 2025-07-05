import { useState } from 'react'
import { seasonList, pokemonList } from '../store'
import PokemonSprite from './PokemonSprite'
import { RoundedSquarePlus } from '../images'

export default function TeamHolder({
	cupData,
	doAction,
	showEditor,
	currentSeason,
	useImages
}) {
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
								className={`cup-team-box ${useImages ? 'with-images' : 'without-images'} ${team.id == cupData.current ? 'current' : ''} ${team.fave ? ' fave-team' : ''}`}
								onClick={() => doAction('switch', { id: team.id })}
							>
								{Array.from({ length: 3 }).map(
									(m, i) => {
										if (useImages) {
											return <div key={'team_' + teamIndex + '_mon_' + i} className="cup-team-mon">
												<PokemonSprite
													size="40"
													pokemon={
														team.mons[i]
															? pokemonList.find(({ value }) => value == team.mons[i].templateId)
															: null
													}
												/>
											</div>
										} else {
											if (typeof team.mons[i] === 'undefined')
												return <div key={'team_' + teamIndex + '_mon_' + i} className="flex-row pokemon-type-box-heading pokemon_type_none">
													<h3>Empty</h3>
													<div className="type-list">
														<span
															className="type_icon pokemon_type_none">
														</span>
													</div>
												</div>

											let myPokemon = pokemonList.find(({ value }) => value == team.mons[i].templateId)

											return <div key={'team_' + teamIndex + '_mon_' + i} className={'flex-row pokemon-type-box-heading ' + myPokemon.types[0].toLowerCase()}>
												<h3>{
													typeof team.mons[i].name !== 'undefined' &&
														team.mons[i].name !== ''
														? team.mons[i].name
														: myPokemon.label
												}</h3>
												<div className="type-list">
													{myPokemon.types.map((type) =>
														<span
															key={type.toLowerCase()}
															className={'type_icon ' + type.toLowerCase()}>
														</span>
													)}
												</div>
											</div>
										}
									}
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	</div >
}
