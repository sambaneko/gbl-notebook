import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	pokemonList,
	saveTeam,
	updateCurrent
} from '../store'
import PokemonSprite from './PokemonSprite'
import { RoundedSquarePlus } from '../images'

export default function TeamHolder({ teams, current, faves, season, cup }) {
	const dispatch = useDispatch()
	const appData = useSelector((state) => state.appData)
	const [openOnNarrow, setOpenOnNarrow] = useState(false)

	const addEmptyTeam = () => {
		dispatch(saveTeam({ season, cup }))
	}

	const switchTeam = (id) => {
		dispatch(updateCurrent({
			season, cup, id
		}))
	}

	return <div id="team-holder">
		<h3 className="on-narrow-hide">Teams</h3>
		<div className="teams-wrapper">

			<button
				className="app-like"
				onClick={() => addEmptyTeam()}
				style={{ width: '100%' }}
				disabled={!season || !cup}
			>
				{!season || !cup
					? <span style={{ fontSize: '1.1rem' }}>
						Select a season to add teams
					</span>
					: <><RoundedSquarePlus /> New Team</>
				}
			</button>

			{teams.length > 0 &&
				<div className={'teams-wrapper-inner' + (openOnNarrow ? ' isOpen' : ' isClosed')}>
					{teams.map((team, teamIndex) =>
						<div
							key={'team_' + teamIndex}
							className={
								'cup-team-box' +
								(team.id == current ? ' current' : '') +
								(faves.find(({ id }) => id == team.id) ? ' fave-team' : '')
							}
							onClick={() => switchTeam(team.id)}
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
			}

			<button id="switch-team" className="small-upper text-center" style={{ border: '1px solid #ececec', color: '#000', padding: '1rem', borderRadius: '.8rem', marginTop: '1rem', background: 'none' }} onClick={() => setOpenOnNarrow(!openOnNarrow)}>{openOnNarrow ? 'Close' : 'Switch Team'}</button>
		</div>
	</div>
}
