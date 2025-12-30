
import { useState, useEffect } from 'react'
import PokemonView from './PokemonView'
import Star from '../images/Star'
import StarFilled from '../images/StarFilled'
import Trash from '../images/Trash'
import Duplicate from '../images/Duplicate'
import styled from 'styled-components'

export default function TeamView({
	team,
	doAction,
	showEditor,
	showModal,
	useImages
}) {
	const [notes, setNotes] = useState('')
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const updateTeam = (data) =>
		doAction('update', {
			data: {
				team: { id: team.id, ...data }
			}
		})

	const duplicateTeam = () =>
		doAction('duplicate', { id: team.id })

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

	return <>
		<div className="section-head flex">
			<div className="flex-grow">
				<h1>Team</h1>
			</div>
			<div className="app-button-group">
				<button
					onClick={() => updateTeam({ fave: !team.fave })}
					className="app-like"
				>{team.fave
					? <StarFilled />
					: <Star />
					}
				</button>
				<button type="button"
					className="app-like"
					onClick={() => duplicateTeam()}
				> <Duplicate />
				</button>
				<button type="button"
					className="app-like"
					onClick={() => showModal(
						<ConfirmationBox>
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
					)}
				> <Trash />
				</button>
			</div>
		</div>
		<section className={'cup-section' + (team.fave ? ' fave-team' : '')}>
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
						<div style={{
							flexGrow: 0,
							fontSize: '1.2rem',
							color: '#999',
							textAlign: 'center',
							paddingTop: '1rem'
						}}>
							<span>Created: {team?.created || '???'}</span>
							<span style={{ marginLeft: '.5rem' }}>Modified: {team?.modified || '???'}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	</>
}
