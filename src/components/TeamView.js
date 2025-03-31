
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { saveTeam, deleteTeam, updateFave, seasonList, moveTeamMember, removeTeamMember } from '../store'
import PokemonView from './PokemonView'
import Star from '../images/Star'
import StarFilled from '../images/StarFilled'
import Trash from '../images/Trash'
import styled from 'styled-components'

export default function TeamView({ season, setEditingPokemon, showModal, team, fave }) {
	const dispatch = useDispatch()

	const [teamNotes, setTeamNotes] = useState('')
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const saveTeamNotes = () => {
		dispatch(
			saveTeam({
				id: team.id,
				notes: teamNotes
			})
		)
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

	useEffect(() => {
		setTeamNotes(team?.notes || '')
	}, [team])

	return <section className={'cup-section' + (fave ? ' fave-team' : '')}>
		<div className="cup-section-head">
			<h2 className="flex-v-center" style={{ flexGrow: 1 }}>Team</h2>
			<div style={{ display: 'flex', marginLeft: '1rem' }}>
				<button
					onClick={() => dispatch(
						updateFave({
							cup: team.cup,
							season: team.season,
							id: team.id
						})
					)}
					style={{ margin: 'auto' }}
					className="plain"
				>{fave
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
						(m, teamIndex) => <PokemonView
							{...{
								key: `tm${teamIndex}`,
								pokemon: team?.mons[teamIndex] ?? null,
								showStats: true,
								onEdit: season === null
									? null
									: () => {
										setEditingPokemon({
											editType: 'team',
											id: team?.id ?? null,
											teamIndex,
											mon: team?.mons[teamIndex] ?? null,
											exclude: team?.mons.map(
												(mon) => {
													return mon?.templateId || null
												}
											) ?? []
										})
									},
								onRemove: () => dispatch(
									removeTeamMember({
										id: team?.id ?? null,
										teamIndex
									})
								),
								onMoveUp: () => teamIndex > 0 && dispatch(
									moveTeamMember({
										id: team?.id ?? null,
										teamIndex,
										dir: -1
									})
								),
								onMoveDown: () => teamIndex < 2 && dispatch(
									moveTeamMember({
										id: team?.id ?? null,
										teamIndex,
										dir: 1
									})
								)
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
						disabled={season === null}
					></textarea>
				</div>
			</div>

			<div style={{ display: 'flex', color: '#999', marginTop: '.5rem', marginBottom: '-.5rem', padding: '0 1rem' }}>
				<div style={{ flexGrow: 1, lineHeight: '4rem', fontSize: '1.4rem' }}>
					{!season &&
						<span style={{ marginRight: '.5rem' }}>
							<button
								className="plain"
								style={{ fontWeight: 600, marginRight: '1rem' }}
								onClick={() => {/*showModal(
									<TeamDataEditor
										cupId={selectedCup.templateId}
										id={cupData.currentTeam}
										selectedSeason={selectedSeason}
									/>
								)*/}}
							>{
									(seasonList.find(({ value }) => value == team?.season)).label
								}</button>
						</span>
					}
					<span>Created: {team?.created || '???'}</span>
					<span style={{ marginLeft: '.5rem' }}>Modified: {team?.modified || '???'}</span>
				</div>
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
										dispatch(deleteTeam(team.id))
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
			</div>
		</div>
	</section>
}
