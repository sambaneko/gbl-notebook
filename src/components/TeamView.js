
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { defaultCup, updateTeam } from '../store'
import PokemonView from './PokemonView'

export default function TeamView({ selectedCup, cupData, setEditingPokemon, removeMon, moveMon }) {
	const dispatch = useDispatch()

	const [currentTeam, setCurrentTeam] = useState(defaultCup.teams[0])
	const [teamNotes, setTeamNotes] = useState('')

	useEffect(() => {
		setCurrentTeam(cupData.teams[cupData.currentTeam])
		setTeamNotes(cupData.teams[cupData.currentTeam].notes)
	}, [cupData])

	const saveTeamNotes = () => {
		dispatch(updateTeam({
			cup: selectedCup.templateId,
			teamIndex: cupData.currentTeam,
			team: { notes: teamNotes }
		}))
	}

	return <section className="cup-section">
		<div className="cup-section-head">
			<h2 className="flex-v-center">Team</h2>
		</div>
		<div className="cup-section-body">
			<div className="flex-container on-narrow-flex-col" style={{ flexGrow: '1' }}>
				<div className="team-grid grid-list">
					{Array.from({ length: 3 }).map(
						(m, i) => <PokemonView
							{...{
								key: 'tmember_' + i,
								pokemon: currentTeam.mons[i] ?? null,
								showStats: true,
								onEdit: () => setEditingPokemon({
									teamIndex: cupData.currentTeam,
									mon: currentTeam.mons[i] ?? null,
									monIndex: i,
									stats: true
								}),
								onRemove: () => removeMon(i, cupData.currentTeam),
								onMoveUp: () => { i >= 1 && moveMon(i, -1, cupData.currentTeam) },
								onMoveDown: () => { i < 2 && moveMon(i, 1, cupData.currentTeam) }
							}}
						/>
					)}
				</div>
				<div style={{ background: '#ececec', padding: '1rem', borderRadius: '.5rem', flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
					<label>Notes</label>
					<textarea
						onBlur={() => saveTeamNotes()}
						onChange={(ev) => setTeamNotes(ev.target.value)}
						value={teamNotes}
						style={{ resize: 'none', flexGrow: '1', borderRadius: '.5rem', border: 'none' }}
					></textarea>
				</div>
			</div>
		</div>
	</section>
}
