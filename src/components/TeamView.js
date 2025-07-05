
import { useState, useEffect } from 'react'
import PokemonView from './PokemonView'
import Star from '../images/Star'
import StarFilled from '../images/StarFilled'
import Trash from '../images/Trash'
import styled from 'styled-components'

export default function TeamView({ team, doAction, showEditor, useImages }) {
	const [notes, setNotes] = useState('')
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const updateTeam = (data) =>
		doAction('update', {
			data: {
				team: { id: team.id, ...data }
			}
		})

	const deleteTeam = () => {
		doAction('delete', { id: team.id })
		setShowDeleteConfirm(false)
	}

	const moveTeamMember = (memberIndex, dir) =>
		doAction('moveMember', {
			id: team.id, memberIndex, dir
		})

	const removeTeamMember = (memberIndex) =>
		doAction('removeMember', {
			id: team.id, memberIndex
		})

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
		setNotes(team?.notes || '')
	}, [team])

	return <section className={'cup-section' + (team.fave ? ' fave-team' : '')}>
		<div className="cup-section-head">
			<h2 className="flex-v-center" style={{ flexGrow: 1 }}>Team</h2>
			<div style={{ display: 'flex', marginLeft: '1rem' }}>
				<button
					onClick={() => updateTeam({ fave: !team.fave })}
					style={{ margin: 'auto' }}
					className="plain"
				>{team.fave
					? <StarFilled />
					: <Star />
					}
				</button>
			</div>
		</div>
		<div className="cup-section-body">
			<div className="flex-container on-narrow-flex-col">
				<div className={`grid-list team-mons ${useImages ? 'with-images' : 'without-images'}`}>
					{Array.from({ length: 3 }).map(
						(m, teamIndex) => <PokemonView
							{...{
								key: `tm${teamIndex}`,
								pokemon: team?.mons[teamIndex] ?? null,
								showStats: true,
								onEdit: () => showEditor({
									editType: 'teamMember',
									editData: {
										teamId: team?.id ?? null,
										teamIndex,
										mon: team?.mons[teamIndex] ?? null
									},
									withExclude: team?.mons.map((m) => m?.templateId || null) ?? []
								}),
								onRemove: () => removeTeamMember(teamIndex),
								onMoveUp: () => teamIndex > 0 &&
									moveTeamMember(teamIndex, -1),
								onMoveDown: () => teamIndex < 2 &&
									moveTeamMember(teamIndex, 1),
								useImages
							}}
						/>
					)}
				</div>
				<div style={{ background: '#ececec', padding: '1rem', borderRadius: '.5rem', flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
					<label>Notes</label>
					<textarea
						onBlur={() => updateTeam({ notes })}
						onChange={(ev) => setNotes(ev.target.value)}
						value={notes}
						style={{ resize: 'none', flexGrow: '1', borderRadius: '.5rem', border: 'none' }}
					></textarea>
				</div>
			</div>

			<div style={{ display: 'flex', color: '#999', marginTop: '.5rem', marginBottom: '-.5rem', padding: '0 1rem' }}>
				<div style={{ flexGrow: 1, lineHeight: '4rem', fontSize: '1.4rem' }}>
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
									onClick={() => deleteTeam()}
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
