import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom"
import {
	leagues,
	pokemonList,
	defaultCup,
	addTeam,
	updateTeam,
	updateCurrentTeam,
	updatePokemon,
	removePokemon,
	rearrangePokemon,
	addOpponent
} from '../store'
import Select from 'react-select'

import PokemonSprite from '../components/PokemonSprite'
import PokemonView from '../components/PokemonView'
import PokemonEditor from '../components/PokemonEditor'
import { RoundedSquarePlus } from '../images'

export function loader({ params }) {
	return leagues.find(({ slug }) => slug === params.cupId) ?? null
}

export default function Cups() {
	const selectedCup = useLoaderData()
	const [showModal] = useOutletContext()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const appData = useSelector((state) => state.appData)

	const [editingPokemon, setEditingPokemon] = useState()
	useEffect(() => {
		editingPokemon && showModal(
			<PokemonEditor
				pokemon={editingPokemon.mon}
				onSave={(editedMon) => saveEditedPokemon(editedMon)}
				enableStats={editingPokemon.stats}
				selectedCup={selectedCup}
			/>
		)
	}, [editingPokemon])

	const initCupData = () => {
		return selectedCup !== null && appData[selectedCup.value]
			? { ...defaultCup, ...appData[selectedCup.value] }
			: defaultCup
	}

	const [cupData, setCupData] = useState(initCupData())
	const [currentTeam, setCurrentTeam] = useState(defaultCup.teams[0])
	const [teamNotes, setTeamNotes] = useState('')

	useEffect(() => {
		setCupData(initCupData())
	}, [appData, selectedCup])

	useEffect(() => {
		setCurrentTeam(cupData.teams[cupData.currentTeam])
		setTeamNotes(cupData.teams[cupData.currentTeam].notes)
	}, [cupData])

	const switchTeam = (teamIndex) => {
		dispatch(updateCurrentTeam({
			cup: selectedCup.templateId,
			teamIndex
		}))
	}

	const addEmptyTeam = () => {
		dispatch(addTeam({
			cup: selectedCup.templateId,
			team: { ...defaultCup.teams[0] }
		}))
	}

	const saveTeamNotes = () => {
		dispatch(updateTeam({
			cup: selectedCup.templateId,
			teamIndex: cupData.currentTeam,
			team: { notes: teamNotes }
		}))
	}

	const saveEditedPokemon = (editedMon) => {
		dispatch(updatePokemon({
			cup: selectedCup.templateId,
			monIndex: editingPokemon.monIndex,
			teamIndex: editingPokemon.teamIndex,
			pokemon: editedMon
		}))
		setEditingPokemon(null)
		showModal(null)
	}

	const removeMon = (monIndex, teamIndex = null) => {
		dispatch(removePokemon({
			cup: selectedCup.templateId,
			monIndex,
			teamIndex
		}))
	}

	const moveMon = (monIndex, direction, teamIndex = null) => {
		dispatch(rearrangePokemon({
			cup: selectedCup.templateId,
			monIndex,
			direction,
			teamIndex
		}))
	}

	const saveOpponent = (opponent) => {
		dispatch(addOpponent({
			cup: selectedCup.templateId,
			opponent
		}))
	}

	return <>
		<div id="top">
			<div id="cup-selection-wrapper">
				<Select
					options={leagues}
					styles={{
						control: (baseStyles, state) => ({
							...baseStyles,
							borderRadius: '3rem',
							padding: '.5rem 1rem'
						}),
						option: (styles, { data, isDisabled, isFocused, isSelected }) => {
							return {
								...styles,
								padding: '2rem'
							}
						}
					}}
					placeholder="Select Cup"
					onChange={(selectedOpt) => {
						navigate('/cups/' + selectedOpt.slug)
					}}
					defaultValue={selectedCup ? selectedCup : null}
				/>
			</div>
		</div>

		<div id="cups-wrapper">
			<div id="side">
				<h3>Teams</h3>
				{selectedCup &&
					<div className="teams-wrapper">
						{selectedCup !== null && appData[selectedCup.value]
							? <>
								<button
									className="app-like"
									onClick={() => addEmptyTeam()}
									style={{ color: '#fff', width: '100%' }}
								><RoundedSquarePlus /> New Team</button>

								{cupData.teams.map((team, teamIndex) =>
									<div key={'team_' + teamIndex} className="cup-team-box" onClick={() => switchTeam(teamIndex)}>
										{team.mons.map((mon, ind) =>
											<div key={'team_' + teamIndex + '_mon_' + ind} className="cup-team-mon">
												<PokemonSprite
													size="40"
													pokemon={pokemonList.find(({ value }) => value == mon.templateId)}
												/>
											</div>
										)}
									</div>
								)}
							</>
							: <p className="small-upper text-center">Saved teams will be listed here</p>
						}
					</div>
				}
			</div>
			<div id="cup-data">
				{selectedCup === null && <>
					<h2>Welcome to GBL Notebook</h2>
					<p>Select a cup from the list above to get started.</p>
				</>}
				{selectedCup && <>
					<section className="cup-section">
						<div className="cup-section-head">
							<h2 className="flex-v-center">Team</h2>
						</div>
						<div className="cup-section-body">
							<div style={{ display: 'flex', flexGrow: '1', gap: '1rem' }}>
								<div style={{ display: 'flex', gap: '1rem' }}>
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
					<section className="cup-section">
						<div className="cup-section-head">
							<div className="flex flex-grow">
								<h2 className="flex-v-center">Notable Opponents</h2>
							</div>
							<button type="button"
								className="app-like"
								onClick={() =>
									showModal(<PokemonEditor
										pokemon={null}
										onSave={(opponent) => saveOpponent(opponent)}
										enableStats={false}
										selectedCup={selectedCup}
									/>)
								}
							> Add
							</button>
						</div>
						{cupData.opponents.length > 0 &&
							<div className="cup-section-body">
								<div className="opponents-list">
									{cupData.opponents.map((mon, monIndex) =>
										<PokemonView
											key={'opponent_' + monIndex}
											pokemon={mon}
											showStats={false}
											onEdit={() => setEditingPokemon({ teamIndex: null, mon, monIndex, stats: false })}
											onRemove={() => removeMon(monIndex)}
											onMoveUp={() => {
												if (monIndex >= 1) {
													moveMon(monIndex, -1)
												}
											}}
											onMoveDown={() => {
												if (monIndex < cupData['opponents'].length - 1) {
													moveMon(monIndex, 1)
												}
											}}
										/>
									)}
								</div>
							</div>
						}
					</section>
				</>}
			</div>
		</div>
	</>
}
