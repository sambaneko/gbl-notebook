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
	const [invalidFields, setInvalidFields] = useState([])
	const [monPopulated, setMonPopulated] = useState(false)

	useEffect(() => {
		setMonPopulated(
			Object.keys(editedMon ?? {}).length > 0
		)
	}, [editedMon])

	const saveEdits = () => {
		setInvalidFields([])

		if (!editedMon) {
			setInvalidFields(['pokemon'])
			return
		}

		let requiredFields = ['fast', 'charge1']

		if (editType != 'opponent') {
			requiredFields.push('name')
		}

		let invalid = requiredFields.filter((req) => {
			if (
				editedMon[req] === undefined ||
				editedMon[req]?.trim() === ''
			) {
				return req
			}
		})

		if (invalid.length) {
			setInvalidFields(invalid)
			return
		}

		onSave && onSave(
			editedMon,
			createTemplate || updateTemplate,
			updateTemplate && usingTemplate !== null
				? usingTemplate.templateIndex
				: null
		)
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
	const [createTemplate, setCreateTemplate] = useState(true)
	const [updateTemplate, setUpdateTemplate] = useState(false)

	useEffect(() => {
		if (createTemplate) setUpdateTemplate(false)
	}, [createTemplate])

	useEffect(() => {
		if (updateTemplate) setCreateTemplate(false)
	}, [updateTemplate])

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

							let eMon = {
								templateId: mon.templateId,
								shadow: false,
								purified: false,
								shiny: false
							}

							if (editType == 'team') {
								eMon.name = mon.label
							}

							setEditedMon(eMon)

							setUsingTemplate(null)
							resetTemplates((prev) => prev + 1)

							setAvailableTemplates(
								appData.templates.map((template, templateIndex) =>
									(
										template.templateId == mon.templateId &&
										(
											editType == 'team'
												? template.name !== undefined
												: template.name === undefined
										)
									)
										? {
											template,
											templateIndex,
											...pokemonList.find(({ templateId }) => templateId == template.templateId)
										}
										: null
								).filter(n => n)
							)
						}}
						defaultValue={pokemonData}
						isInvalid={invalidFields.includes('pokemon')}
					/>
				</div>

				{availableTemplates.length > 0 && <div className="grid-fashion template-box">
					<label>Templates</label>
					{availableTemplates.map((mon, i) =>
						<div className={'pointer pokemon_option pokemon_type ' + mon.types[0].toLowerCase()} key={i}>
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
							<div style={{ padding: '8px 12px' }}
								onClick={() => {
									setPokemonData(mon)
									setEditedMon(mon.template)
									setUsingTemplate(mon)
									setCreateTemplate(false)
									setUpdateTemplate(false)
									resetSelector((prev) => prev + 1)
								}}
							>{
									mon.template.name === undefined
										? mon.label
										: (
											mon.template.name == ''
												? mon.label
												: mon.template.name
										)

								}</div>
						</div>
					)}
				</div>}

				<hr />
			</>
		}

		{editType == 'team' &&
			<div className="grid-fashion">
				<label>Name</label>
				<input type="text"
					onBlur={(ev) =>
						setEditedMon({
							...editedMon,
							name: ev.target.value
						})
					}
					defaultValue={editedMon?.name}
					disabled={!monPopulated}
					className={invalidFields.includes('name') ? 'invalidField' : ''}
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
						onChange={(move) => setEditedMon({
							...editedMon, fast: move.value
						})}
						isDisabled={!monPopulated}
						defaultValue={
							moveList.find(({ value }) => value === editedMon?.fast)
						}
						classNames={{
							control: (state) => invalidFields.includes('fast') ? 'invalidField' : ''
						}}
					/>
				</div>
				<div className="grid2">
					<label>Charge Move</label>
					<Select
						options={
							moveList.filter(({ value }) => pokemonData.chargeMoves.includes(value) && editedMon?.charge2 !== value)
						}
						styles={{
							option: (styles, { data, isDisabled, isFocused, isSelected }) => {
								return { ...styles, padding: '2rem' }
							}
						}}
						onChange={(move) => setEditedMon({
							...editedMon, charge1: move.value
						})}
						isDisabled={!monPopulated}
						defaultValue={
							moveList.find(({ value }) => value === editedMon?.charge1)
						}
						classNames={{
							control: (state) => invalidFields.includes('charge1') ? 'invalidField' : ''
						}}
					/>
				</div>
				<div className="grid3">
					<label>Charge Move</label>
					<Select
						options={
							moveList.filter(({ value }) => pokemonData.chargeMoves.includes(value) && editedMon?.charge1 !== value)
						}
						styles={{
							option: (styles, { data, isDisabled, isFocused, isSelected }) => {
								return { ...styles, padding: '2rem' }
							}
						}}
						onChange={(move) => setEditedMon({
							...editedMon, charge2: move.value
						})}
						isDisabled={!monPopulated}
						defaultValue={
							moveList.find(({ value }) => value === editedMon?.charge2)
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
							disabled={!monPopulated}
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
								disabled={!monPopulated}
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
								disabled={!monPopulated}
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
								disabled={!monPopulated}
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
						<label className={
							'checkbox' + (
								!monPopulated ? ' disabled' : ''
							)
						} key={editedMon?.shadow ? 'a' : 'b'}>
							<input
								defaultChecked={editedMon?.shadow || false}
								type="checkbox"
								disabled={
									!monPopulated ||
									!pokemonData.shadowAvailable
								}
								onClick={(ev) => {
									let mon = { ...editedMon }
									mon.shadow = ev.target.checked
									if (ev.target.checked) {
										mon.purified = false
									}
									setEditedMon(mon)
								}}
							/> Shadow
						</label>
					</div>
					<div className="grid4">
						<label className={
							'checkbox' + (
								!monPopulated ? ' disabled' : ''
							)
						} key={editedMon?.purified ? 'a' : 'b'}>
							<input
								defaultChecked={editedMon?.purified || false}
								type="checkbox"
								disabled={
									!monPopulated ||
									!pokemonData.shadowAvailable
								}
								onClick={(ev) => {
									let mon = { ...editedMon }
									mon.purified = ev.target.checked
									if (ev.target.checked) {
										mon.shadow = false
									}
									setEditedMon(mon)
								}}
							/> Purified
						</label>
					</div>
					<div className="grid5">
						<label className={
							'checkbox' + (
								!monPopulated ? ' disabled' : ''
							)
						}>
							<input
								defaultChecked={editedMon?.shiny || false}
								type="checkbox"
								onClick={(ev) => {
									setEditedMon({
										...editedMon,
										shiny: ev.target.checked
									})
								}}
								disabled={!monPopulated}
							/> Shiny
						</label>
					</div>
				</div>
			</>}
		</div>

		<div className="flex-row">
			<div>
				{!pokemon &&
					<div className="flex-row">
						<label className="checkbox" style={{ borderColor: 'transparent', flexGrow: 0, whiteSpace: 'nowrap' }} key={createTemplate ? 'a' : 'b'}>
							<input
								defaultChecked={createTemplate}
								type="checkbox"
								onClick={() => setCreateTemplate(!createTemplate)}
							/> Create Template
						</label>
						{usingTemplate !== null &&
							<label className="checkbox" style={{ borderColor: 'transparent' }} key={updateTemplate ? 'c' : 'd'}>
								<input
									defaultChecked={updateTemplate}
									type="checkbox"
									onClick={() => setUpdateTemplate(!updateTemplate)}
								/> Update Template
							</label>
						}
					</div>
				}
			</div>
			<div className="text-right" style={{ flexGrow: 0 }}>
				<button type="button"
					className="app-like"
					onClick={saveEdits}
				> Save
				</button>
			</div>
		</div>
	</div>
}
