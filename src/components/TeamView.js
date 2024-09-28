
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { defaultCup, updateTeam, deleteTeam, seasonList } from '../store'
import PokemonView from './PokemonView'
import Star from '../images/Star'
import StarFilled from '../images/StarFilled'
import Trash from '../images/Trash'
import styled from 'styled-components'

export default function TeamView({ selectedCup, selectedSeason, cupData, setEditingPokemon, removeMon, moveMon, showModal }) {
	const dispatch = useDispatch()

	const [currentTeam, setCurrentTeam] = useState(defaultCup.teams[0])
	const [teamNotes, setTeamNotes] = useState('')
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	useEffect(() => {
		if (cupData.teams[cupData.currentTeam]) {
			setCurrentTeam(cupData.teams[cupData.currentTeam])
			setTeamNotes(cupData.teams[cupData.currentTeam].notes)
		} else {
			setCurrentTeam(defaultCup.teams[0])
			setTeamNotes('')
		}
	}, [cupData])

	const saveTeamNotes = () => {
		dispatch(updateTeam({
			season: selectedSeason.value,
			cup: selectedCup.templateId,
			teamIndex: cupData.currentTeam,
			team: { notes: teamNotes }
		}))
	}

	const ConfirmationBox = styled.div`
		display: flex;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 1.4rem;
		border-radius: .5rem;
		padding: .5rem 0 .5rem 2rem;
  		width: 100%;
		color: #333;
	`

	return <section className={'cup-section' + (currentTeam?.fave ? ' fave-team' : '')}>
		<div className="cup-section-head">
			<h2 className="flex-v-center" style={{ flexGrow: 1 }}>Team</h2>
			<div style={{ display: 'flex', marginLeft: '1rem' }}>
				<button
					onClick={() => dispatch(updateTeam({
						cup: selectedCup.templateId,
						teamIndex: cupData.currentTeam,
						team: { fave: !currentTeam?.fave }
					}))}
					style={{ margin: 'auto' }}
					className="plain"
				>{currentTeam?.fave
					? <StarFilled />
					: <Star />
					}
				</button>
			</div>
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
									editType: 'team',
									teamIndex: cupData.currentTeam,
									mon: currentTeam.mons[i] ?? null,
									monIndex: i,
									stats: true,
									exclude: currentTeam.mons.map(({ templateId }) => templateId)
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
			<div style={{ display: 'flex', color: '#999', marginTop: '.5rem', marginBottom: '-.5rem', padding: '0 1rem' }}>
				<div style={{ flexGrow: 1, lineHeight: '4rem', fontSize: '1.4rem' }}>
					{selectedSeason.value == 'all' &&
						<span style={{ marginRight: '.5rem' }}>
							<button
								className="plain"
								onClick={() => {/*showModal(
								<TeamDataEditor
									cupId={selectedCup.templateId}
									teamId={cupData.currentTeam}
									selectedSeason={selectedSeason}
								/>
							)*/}}
							>{currentTeam?.season !== undefined
								? (seasonList.find(({ value }) => value == currentTeam.season)).label
								: 'Season not assigned'
								}</button>
						</span>
					}
					{currentTeam?.created !== undefined &&
						<span>Created: {(() => {
							let d = new Date(currentTeam.created)
							return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`
						})()}</span>
					}
					{currentTeam?.modified !== undefined &&
						<span style={{ marginLeft: '.5rem' }}>Modified: {currentTeam.modified}</span>
					}
				</div>
				{currentTeam.mons.length >= 3 &&
					<div style={{ display: 'flex', minWidth: '30rem' }}>
						{showDeleteConfirm
							? <ConfirmationBox>
								<div style={{ margin: 'auto 0' }}>
									<p>Are you sure?</p>
								</div>
								<div style={{ marginLeft: 'auto' }}>
									<button
										onClick={() => setShowDeleteConfirm(false)}
										className="outlined"
										style={{ marginRight: '1rem' }}
									>Cancel</button>
									<button
										onClick={() => {
											dispatch(deleteTeam({
												cup: selectedCup.templateId,
												teamIndex: cupData.currentTeam
											}))
											setShowDeleteConfirm(false)
										}}
										className="filled warning"
									>Delete Team</button>
								</div>
							</ConfirmationBox>
							: <button type="button"
								className="plain"
								style={{ margin: 'auto 0 auto auto' }}
								onClick={() => setShowDeleteConfirm(true)}
							> <Trash />
							</button>
						}
					</div>
				}
			</div>
		</div>
	</section>
}
