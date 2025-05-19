import { useState } from 'react'
import Select from 'react-select'
import { pokemonList, seasonList } from '../store'
import PokemonEditor from '../components/PokemonEditor'
import PokemonSprite from './PokemonSprite'

export default function TeamEditor(withData) {
	const [teamMons, setTeamMons] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)

	const filterSeasons = ([...seasonList]).filter(
		({ cups }) => cups.includes(withData.withCup.templateId)
	)
	const [season, setSeason] = useState(filterSeasons[0])

	const saveTeam = () => {
		const mons = []
		const templates = []

		teamMons.forEach((teamMon) => {
			mons.push(teamMon.mon)
			if (
				teamMon.template.create ||
				teamMon.template.update
			) {
				templates.push({
					templateIndex: (
						teamMon.template.update
							? teamMon.template.using
							: null
					),
					pokemon: teamMon.mon
				})
			}
		})

		withData.onSave({
			editType: withData.editType,
			data: {
				team: { mons, season: season.value },
				templates
			}
		})
	}

	return <div>
		<div>
			<Select
				options={filterSeasons}
				onChange={(selected) => setSeason(selected)}
				defaultValue={season}
			/>
		</div>
		<div className="cup-team-box" style={{ margin: '2rem auto' }}>
			{Array.from({ length: 3 }).map(
				(m, i) => <div
					key={i}
					className={
						'cup-team-mon' +
						(i == currentIndex ? ' isSelected' : '')
					}
					onClick={() => setCurrentIndex(i)}
				>
					<PokemonSprite
						size="40"
						pokemon={
							teamMons?.[i]?.mon
								? pokemonList.find(({ value }) => value == teamMons[i].mon.templateId)
								: null
						}
					/>
				</div>
			)}
		</div>
		<div key={currentIndex} >
			<PokemonEditor
				{...withData}
				editData={teamMons?.[currentIndex] ?? {}}
				withExclude={
					teamMons.map((each) => each?.mon?.templateId ?? null)
				}
				onEdit={(pokemon) => {
					let mons = [...teamMons]
					mons[currentIndex] = pokemon
					setTeamMons(mons)
				}}
				onSave={() => saveTeam()}
			/>
		</div>
	</div>
}
