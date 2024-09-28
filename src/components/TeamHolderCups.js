import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	pokemonList,
	defaultCup,
	addTeam,
	updateCurrentTeam
} from '../store'
import PokemonSprite from './PokemonSprite'
import { RoundedSquarePlus } from '../images'

export default function TeamHolderCups({ selectedCup, selectedSeason, cupData }) {
	const dispatch = useDispatch()
	const appData = useSelector((state) => state.appData)
	const [openOnNarrow, setOpenOnNarrow] = useState(false)

	const addEmptyTeam = () => {
		dispatch(addTeam({
			season: selectedSeason.value,
			cup: selectedCup.templateId,
			team: { ...defaultCup.teams[0] }
		}))
	}

	const switchTeam = (teamIndex) => {
		dispatch(updateCurrentTeam({
			season: selectedSeason.value,
			cup: selectedCup.templateId,
			teamIndex
		}))
	}

	return <div id="team-holder">
		<h3 className="on-narrow-hide">Teams</h3>
		{selectedCup !== null && <div className="teams-wrapper">
			{appData.cups[selectedCup.value]
				? <>
					<button
						className="app-like"
						onClick={() => addEmptyTeam()}
						style={{ color: '#fff', width: '100%' }}
					><RoundedSquarePlus /> New Team</button>
					<div className={'teams-wrapper-inner' + (openOnNarrow ? ' isOpen' : ' isClosed')}>
						{cupData.teams.map((team, teamIndex) =>
							<div key={'team_' + teamIndex} className={'cup-team-box' + (teamIndex == cupData.currentTeam ? ' current' : '') + (team?.fave ? ' fave-team' : '')} onClick={() => switchTeam(teamIndex)}>
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
				</>
				: <p className="small-upper text-center">Saved teams will be listed here</p>
			}

			<button id="switch-team" className="small-upper text-center" style={{ border: '1px solid #ececec', color: '#000', padding: '1rem', borderRadius: '.8rem', marginTop: '1rem', background: 'none' }} onClick={() => setOpenOnNarrow(!openOnNarrow)}>{openOnNarrow ? 'Close' : 'Switch Team'}</button>
		</div>}
	</div>
}
