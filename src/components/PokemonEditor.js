import { useState, useEffect } from 'react'
import PokemonSelect from './PokemonSelect'
import Select from 'react-select'
import { pokemonList, moveList } from '../store'

export default function PokemonEditor({
	pokemon,
	enableStats,
	selectedCup,
	excludeList,
	onSave
}) {
	const [pokemonData, setPokemonData] = useState(
		pokemon !== null
			? pokemonList.find(({ value }) => value == pokemon.templateId)
			: { fastMoves: [], chargeMoves: [] }
	)
	const [editedMon, setEditedMon] = useState(pokemon)

	const saveEdits = () => {
		onSave && onSave(editedMon)
		setEditedMon(null)
		setRefresher(refresher + 1)
	}

	const [refresher, setRefresher] = useState(0)

	return <div key={'pokemon-editor-' + refresher}>
		{pokemon &&
			<div className={'flex-row pokemon-type-box-heading edit-heading ' + pokemonData.types[0].toLowerCase()}>
				<h3>{pokemonData.label}</h3>
				<div className="type-list">
					{pokemonData.types.map((type) =>
						<span
							key={type.toLowerCase()}
							className={'type_icon ' + type.toLowerCase()}>
						</span>
					)}
				</div>
			</div>
		}

		<span className="small-upper">Required</span>
		<div className="gc gc-basics">
			{!pokemon &&
				<div className="gi gi-g1">
					<PokemonSelect
						{...{ selectedCup, excludeList }}
						onSelected={(mon) => {
							setPokemonData(mon)
							setEditedMon({
								templateId: mon.templateId,
								shadow: false,
								purified: false,
								shiny: false
							})
						}}
					/>
				</div>
			}
			<div className="gi gi-g2">
				<label>Fast Move</label>
				<Select
					options={
						moveList.filter(({ value }) => pokemonData.fastMoves.includes(value))
					}
					styles={{
						option: (styles, { data, isDisabled, isFocused, isSelected }) => {
							return { ...styles, padding: '2rem' }
						}
					}}
					onChange={(fast) => setEditedMon({ ...editedMon, fast })}
					isDisabled={Object.keys(editedMon ?? {}).length <= 0}
					defaultValue={
						moveList.find(({ value }) => value === editedMon?.fast?.value)
					}
				/>
			</div>
			<div className="gi gi-g3">
				<label>Charge Move</label>
				<Select
					options={
						moveList.filter(({ value }) => pokemonData.chargeMoves.includes(value) && editedMon?.charge2?.value !== value)
					}
					styles={{
						option: (styles, { data, isDisabled, isFocused, isSelected }) => {
							return { ...styles, padding: '2rem' }
						}
					}}
					onChange={(charge1) => setEditedMon({ ...editedMon, charge1 })}
					isDisabled={Object.keys(editedMon ?? {}).length <= 0}
					defaultValue={
						moveList.find(({ value }) => value === editedMon?.charge1?.value)
					}
				/>
			</div>
			<div className="gi gi-g4">
				<label>Charge Move</label>
				<Select
					options={
						moveList.filter(({ value }) => pokemonData.chargeMoves.includes(value) && editedMon?.charge1?.value !== value)
					}
					styles={{
						option: (styles, { data, isDisabled, isFocused, isSelected }) => {
							return { ...styles, padding: '2rem' }
						}
					}}
					onChange={(charge2) => setEditedMon({ ...editedMon, charge2 })}
					isDisabled={Object.keys(editedMon ?? {}).length <= 0}
					defaultValue={
						moveList.find(({ value }) => value === editedMon?.charge2?.value)
					}
				/>
			</div>
		</div>

		{enableStats && <>
			<span className="small-upper">Optional</span>
			<div className="gc gc-stats">
				<div className="gi gi-g1">
					<label>CP</label>
					<input type="number" min="0"
						onBlur={(ev) => setEditedMon({
							...editedMon,
							cp: ev.target.value
						})}
						defaultValue={editedMon?.cp}
					/>
				</div>
				<div className="gi gi-g2 flex-row">
					<div>
						<label>Attack IV</label>
						<select
							defaultValue={editedMon?.ivs?.atk}
							onChange={(ev) => setEditedMon({
								...editedMon,
								ivs: {
									...(editedMon['ivs'] ? editedMon.ivs : {}),
									atk: ev.target.value
								}
							})}
						>
							<option key="atk_none">-</option>
							{
								[...Array(16).keys()].map((o) =>
									<option key={'atk' + o} value={o}>{o}</option>)
							}
						</select>
					</div>
					<div>
						<label>Defense IV</label>
						<select
							defaultValue={editedMon?.ivs?.def}
							onChange={(ev) => setEditedMon({
								...editedMon,
								ivs: {
									...(editedMon['ivs'] ? editedMon.ivs : {}),
									def: ev.target.value
								}
							})}
						>
							<option key="def_none">-</option>
							{
								[...Array(16).keys()].map((o) =>
									<option key={'def' + o} value={o}>{o}</option>)
							}
						</select>
					</div>
					<div>
						<label>Stamina IV</label>
						<select
							defaultValue={editedMon?.ivs?.sta}
							onChange={(ev) => setEditedMon({
								...editedMon,
								ivs: {
									...(editedMon['ivs'] ? editedMon.ivs : {}),
									sta: ev.target.value
								}
							})}
						>
							<option key="sta_none">-</option>
							{
								[...Array(16).keys()].map((o) =>
									<option key={'sta' + o} value={o}>{o}</option>)
							}
						</select>
					</div>
				</div>

				<div className="gi gi-g3">
					<label className="checkbox">
						<input
							defaultChecked={editedMon?.shadow || false}
							type="checkbox"
							disabled={!pokemonData.shadowAvailable}
							onClick={() => {
								setEditedMon({
									...editedMon,
									shadow: true,
									purified: false
								})
							}}
						/> Shadow
					</label>
				</div>
				<div className="gi gi-g4">
					<label className="checkbox">
						<input
							defaultChecked={editedMon?.purified || false}
							type="checkbox"
							disabled={!pokemonData.shadowAvailable}
							onClick={() => {
								setEditedMon({
									...editedMon,
									shadow: false,
									purified: true
								})
							}}
						/> Purified
					</label>
				</div>
				<div className="gi gi-g5">
					<label className="checkbox">
						<input
							defaultChecked={editedMon?.shiny || false}
							type="checkbox"
							onClick={() => {
								setEditedMon({
									...editedMon,
									shiny: true
								})
							}}
						/> Shiny
					</label>
				</div>
			</div>
		</>}

		<div className="text-right">
			<button type="button"
				className="app-like"
				onClick={saveEdits}
			> Save
			</button>
		</div>
	</div>
}
