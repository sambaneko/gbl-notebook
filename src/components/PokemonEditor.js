import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PokemonSelectFromCup from './PokemonSelectFromCup'
import Select from 'react-select'
import { pokemonList, moveList } from '../store'

export default function PokemonEditor({
	editType,
	pokemon,
	selectedCup,
	excludeList,
	onSave
}) {
	const appData = useSelector((state) => state.appData)

	const [pokemonData, setPokemonData] = useState(
		pokemon !== null
			? pokemonList.find(({ value }) => value == pokemon.templateId)
			: { fastMoves: [], chargeMoves: [] }
	)
	const [editedMon, setEditedMon] = useState(pokemon)

	const saveEdits = () => {
		onSave && onSave(editedMon, saveTemplate, usingTemplate)
		setEditedMon(null)
		resetEditor((prev) => prev + 1)
	}

	const [editorItr, resetEditor] = useState(0)
	const [templatesItr, resetTemplates] = useState(0)
	const [selectorItr, resetSelector] = useState(0)
	const [fieldsItr, resetFields] = useState(0)

	useEffect(() => {
		resetFields((prev) => prev + 1)
	}, [templatesItr, selectorItr])

	const [usingTemplate, setUsingTemplate] = useState(null)
	const [saveTemplate, setSaveTemplate] = useState(pokemon ? false : true)

	const [availableTemplates, setAvailableTemplates] = useState([])

	return <div key={'pokemon-editor-' + editorItr}>
		{pokemon
			? <div className={'flex-row pokemon-type-box-heading edit-heading ' + pokemonData.types[0].toLowerCase()}>
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
			: <>
				<div className="grid-fashion" key={'selector-' + selectorItr}>
					<PokemonSelectFromCup
						pokemon={pokemonList}
						{...{ selectedCup }}
						exclude={excludeList}
						onSelected={(mon) => {
							setPokemonData(mon)
							setEditedMon({
								templateId: mon.templateId,
								shadow: false,
								purified: false,
								shiny: false
							})
							setUsingTemplate(null)
							resetTemplates((prev) => prev + 1)

							setAvailableTemplates(
								appData.templates.map((template, templateIndex) => {
									if (
										template.templateType == editType &&
										template.templateId == mon.templateId
									) {
										return {
											template,
											templateIndex,
											...pokemonList.find(({ value }) => value == template.templateId)
										}
									}
								}).filter(n => n)
							)
						}}
						defaultValue={pokemonData}
					/>
				</div>

				{availableTemplates.length > 0 && <div className="grid-fashion template-box">
					<label>Templates</label>
					{availableTemplates.map((mon) =>
						<div className={'pointer pokemon_option pokemon_type ' + mon.types[0].toLowerCase()}>
							<div className="type-list">
								{
									mon.types.map((type) =>
										<span
											key={type.toLowerCase()}
											className={'type_icon ' + type.toLowerCase()}>
										</span>
									)
								}
							</div>
							<div style={{padding: '8px 12px'}}
							onClick={() => {
								setPokemonData(mon)
								setEditedMon(mon.template)
								setUsingTemplate(mon.templateIndex)
								resetSelector((prev) => prev + 1)
							}}
							>{mon.label}</div>
						</div>
					)}
				</div>}

				<hr />
			</>
		}

		{editType == 'team' &&
			<div className="grid-fashion">
				<label>Name</label>
				<input type="text" min="0"
					onBlur={(ev) => setEditedMon({
						...editedMon,
						name: ev.target.value
					})}
					defaultValue={editedMon?.name}
				/>
			</div>
		}

		<div key={'fields-' + fieldsItr}>
			<div className="grid grid-fashion grid-moves">
				<div className="grid1">
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
				<div className="grid2">
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
				<div className="grid3">
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

			{editType == 'team' && <>
				<div className="grid grid-fashion grid-stats">
					<div className="grid1">
						<label>CP</label>
						<input type="number" min="0"
							onBlur={(ev) => setEditedMon({
								...editedMon,
								cp: ev.target.value
							})}
							defaultValue={editedMon?.cp}
						/>
					</div>
					<div className="grid2 flex-row">
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

					<div className="grid3">
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
					<div className="grid4">
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
					<div className="grid5">
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
		</div>

		<div className="flex-row">
			<div>
				{!pokemon &&
					<label className="checkbox" style={{ borderColor: 'transparent' }}>
						<input
							defaultChecked={true}
							type="checkbox"
							onClick={() => setSaveTemplate(!saveTemplate)}
						/> {usingTemplate !== null ? 'Update Template' : 'Save to Templates'}
					</label>
				}
			</div>
			<div className="text-right">
				<button type="button"
					className="app-like"
					onClick={saveEdits}
				> Save
				</button>
			</div>
		</div>
	</div>
}
