import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PokemonSelectFromCup from './PokemonSelectFromCup'
import PokemonSelect from './PokemonSelect'
import Select from 'react-select'
import { pokemonList, moveList } from '../store'

export default function PokemonEditor({
	editType,
	editData = {},
	withCup,
	withExclude,
	onSave,
	onEdit
}) {
	const appData = useSelector((state) => state.appData)

	// existing editTypes: team, teamMember, opponent
	const isNamed = ['team', 'teamMember'].includes(editType)

	const commitLabel = editType === 'team'
		? 'Add' : (Object.keys(editData).length <= 0 ? 'Add' : 'Save')
	const resetAfterCommit = editType === 'teamMember'
		? false : Object.keys(editData).length <= 0

	editData = { mon: null, template: null, ...editData }

	const initPokeData = () => editData.mon !== null
		? pokemonList.find(
			({ value }) => value == editData.mon.templateId
		)
		: { fastMoves: [], chargeMoves: [] }
	const [pokemonData, setPokemonData] = useState(initPokeData())

	const initTemplates = () => ({
		using: editData.template?.using || null,
		create: editData.template?.create || false,
		update: editData.template?.update || false
	})
	const [templates, setTemplates] = useState(initTemplates())

	const toggleTemplates = (key) => {
		let newTemplates = { ...templates, [key]: !templates[key] }
		if (key === 'create' && newTemplates[key])
			newTemplates.update = false
		if (key === 'update' && newTemplates[key])
			newTemplates.create = false
		setTemplates(newTemplates)
	}

	const [editedMon, setEditedMon] = useState(editData.mon)
	const [invalidFields, setInvalidFields] = useState([])
	const [monPopulated, setMonPopulated] = useState(false)

	const [editorItr, resetEditor] = useState(0)
	const [fieldsItr, resetFields] = useState(0)

	const getAvailableTemplates = (mon) => appData.templates
		.filter(
			template => template.templateId === mon.templateId &&
				(
					isNamed
						? template.name !== undefined
						: template.name === undefined
				)
		)
		.map(
			(template, templateIndex) => {
				const pokeData = pokemonList.find(
					p => p.templateId === template.templateId
				) || {}
				return {
					template,
					templateIndex,
					...pokeData,
					label: template.name || pokeData.label
				}
			})

	const [availableTemplates, setAvailableTemplates] = useState(
		editData.mon !== null ? getAvailableTemplates(editData.mon) : []
	)

	const getReturnableMon = () => {
		let mon = {
			editType,
			mon: editedMon,
			template: { ...templates }
		}

		if (editData.teamId !== undefined)
			mon.teamId = editData.teamId
		if (editData.teamIndex !== undefined)
			mon.teamIndex = editData.teamIndex

		return mon
	}

	const onCommit = () => {
		setInvalidFields([])

		if (!editedMon) {
			setInvalidFields(['pokemon'])
			return
		}

		let requiredFields = ['fast', 'charge1']

		if (isNamed) requiredFields.push('name')

		let invalid = requiredFields.filter(req => !editedMon[req]?.trim())
		if (invalid.length) {
			setInvalidFields(invalid)
			return
		}

		onSave && onSave(getReturnableMon())

		if (resetAfterCommit) {
			setEditedMon(null)
			setPokemonData(initPokeData())
			setTemplates(initTemplates())
			resetEditor((prev) => prev + 1)
		}
	}

	useEffect(() => {
		setMonPopulated(
			Object.keys(editedMon ?? {}).length > 0
		)
		onEdit && onEdit(getReturnableMon())
	}, [editedMon, templates])

	return <div key={'pokemon-editor-' + editorItr}>
		{editData.mon !== null && editType !== 'team'
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
				<div className="grid-fashion">
					<PokemonSelectFromCup
						pokemon={pokemonList}
						selectedCup={withCup}
						exclude={withExclude}
						onChange={(mon) => {
							setPokemonData(mon)

							let eMon = {
								templateId: mon.templateId,
								bestBuddy: false,
								shadow: false,
								purified: false,
								shiny: false
							}

							if (isNamed) eMon.name = mon.label

							setEditedMon(eMon)

							setTemplates(prev => ({ ...prev, using: null }))
							resetFields(prev => prev + 1)

							setAvailableTemplates(
								getAvailableTemplates(mon)
							)
						}}
						defaultValue={pokemonData}
						isInvalid={invalidFields.includes('pokemon')}
						autoFocus
					/>
				</div>

				<div className="grid-fashion template-box">
					<label>Templates</label>
					<PokemonSelect
						pokemon={availableTemplates}
						defaultValue={
							templates.using !== null
								? availableTemplates.find(
									({ templateIndex }) => templateIndex === templates.using
								)
								: null
						}
						isDisabled={availableTemplates.length <= 0}
						onChange={(mon) => {
							let usingTemplate = null
							if (mon !== null) {
								setPokemonData(mon)
								setEditedMon(mon.template)
								usingTemplate = mon.templateIndex
							}
							setTemplates(prev => ({
								...prev,
								using: usingTemplate,
								create: false,
								update: false
							}))
						}}
						isClearable={true}
					/>
				</div>

				<hr />
			</>
		}

		<div key={'fields-' + fieldsItr}>
			{isNamed &&
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

			{isNamed && <div className="grid grid-fashion grid-stats">
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

				<div className="grid6">
					<label className={
						'checkbox' + (
							!monPopulated ? ' disabled' : ''
						)
					} key={editedMon?.bestBuddy ? 'a' : 'b'}>
						<input
							defaultChecked={editedMon?.bestBuddy || false}
							type="checkbox"
							disabled={!monPopulated}
							onClick={(ev) => {
								let mon = { ...editedMon }
								mon.bestBuddy = ev.target.checked
								setEditedMon(mon)
							}}
						/> <span>Best Buddy</span>
					</label>
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
						/> <span>Shadow</span>
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
						/> <span>Purified</span>
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
						/> <span>Shiny</span>
					</label>
				</div>
			</div>}

			{(!isNamed && pokemonData.shadowAvailable) && <div className="grid grid-fashion grid-stats no-name">
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
						/> <span>Shadow</span>
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
						/> <span>Purified</span>
					</label>
				</div>
			</div>}
		</div>

		<div className="flex-row">
			{(editData.mon === null || editType === 'team') &&
				<div className="flex-row">
					<label className="checkbox" style={{ borderColor: 'transparent', flexGrow: 0, whiteSpace: 'nowrap' }} key={templates.create ? 'a' : 'b'}>
						<input
							defaultChecked={templates.create}
							type="checkbox"
							onClick={() => toggleTemplates('create')}
						/> Create Template
					</label>
					{templates.using !== null &&
						<label className="checkbox" style={{ borderColor: 'transparent' }} key={templates.update ? 'c' : 'd'}>
							<input
								defaultChecked={templates.update}
								type="checkbox"
								onClick={() => toggleTemplates('update')}
							/> Update Template
						</label>
					}
				</div>
			}
			<div className="text-right" style={{ flexGrow: 0, marginLeft: 'auto' }}>
				<button type="button"
					className="app-like"
					onClick={onCommit}
				> {commitLabel}
				</button>
			</div>
		</div>
	</div>
}
