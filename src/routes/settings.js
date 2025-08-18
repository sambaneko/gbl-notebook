import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { importAppData, updateSettings, seasonList } from '../store'
import Select from 'react-select'
import styled from 'styled-components'

export default function Settings() {
	const appData = useSelector((state) => state.appData)
	const dispatch = useDispatch()

	const [myState, setMyState] = useState()

	const fileInputField = useRef(null)
	const handleFileUpload = (e) => {
		const reader = new FileReader()
		reader.addEventListener('load', () => {
			dispatch(importAppData(
				JSON.parse(reader.result)
			))
		})
		reader.readAsText(e.target.files[0])
	}

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const deleteAppData = () => {
		setMyState('deleting')
		dispatch(importAppData(null))
	}

	useEffect(() => {
		if (myState === 'deleting') {
			setShowDeleteConfirm(false)
			setMyState(null)
		}
	}, [appData])

	const updateSeason = (season) => dispatch(
		updateSettings({ season })
	)

	const updateImages = (images) => dispatch(
		updateSettings({ images })
	)

	// todo: validate the inputs for these:

	const [imagesPath, setImagesPath] = useState(appData.settings.imagesPath)
	const updateImagesPath = () => dispatch(
		updateSettings({ imagesPath })
	)

	const [timezone, setTimezone] = useState(appData.settings.timezone)
	const updateTimezone = () => dispatch(
		updateSettings({ timezone })
	)

	const SettingRow = styled.div`
		display: flex;
		flex-direction: column;
		padding: 3rem 0;
		border-bottom: 1px solid #E5E5E5;
		& > div:first-child {
			flex-shrink: 0;
			margin: auto 0;
			font-weight: 600;
			color: #4C676A;
			display: flex;
			& > *:first-child {
				font-size: 1.8rem;
				width: 20rem;
				flex-shrink: 0;
				margin: auto 0;
			}				
			& > *:last-child {
				width: 100%;
				padding-left: 2rem;
				text-align: right;
			}			
		}

		&:first-child {
			padding-top: 0;
		}

		&:last-child {
			padding-bottom: 0;
			border: none;
		}
		
		& .setting-desc {
			color: grey;
			margin-top: 2rem;
		}
	`

	const ConfirmationBox = styled.div`
		display: flex;
		font-weight: 600;
		text-transform: uppercase;
  		font-size: 1.4rem;
		background-color: #e6e6e6;
		border-radius: .5rem;
		padding: 1rem 2rem;
	`

	return <section className="page" style={{ flexDirection: 'column' }}>
		<h3 className="page-heading" tabIndex="1">Settings</h3>
		<section className="page-block">
			<SettingRow>
				<div>
					<div>Current Season</div>
					<div>
						<Select
							options={seasonList}
							defaultValue={
								appData.settings.season !== undefined
									? seasonList.find(({ value }) => value === appData.settings.season)
									: seasonList[0]
							}
							onChange={(season) => updateSeason(season.value)}
							styles={{
								control: (styles) => ({
									...styles,
									textTransform: 'uppercase',
									borderRadius: '3rem',
									borderColor: '#3ABCA0',
									borderWidth: '2px',
									textAlign: 'left',
									padding: '.5rem 1rem',
									'&:hover': {
										borderColor: '#44DABA'
									},
								}),
								option: (styles) => ({
									...styles,
									textTransform: 'uppercase',
									textAlign: 'left',
								}),
								singleValue: (provided, state) => ({
									...provided,
									color: '#3ABCA0'
								}),
								dropdownIndicator: (provided) => ({
									...provided,
									color: '#3ABCA0',
									svg: { fill: '#3ABCA0' },
								}),
							}}
						/>
					</div>
				</div>
				<div className="setting-desc">
					<p>Newly-added teams will be assigned to this season, and it will be the default season displayed in the teams list.</p>
				</div>
			</SettingRow>
		</section>
		<section className="page-block">
			<SettingRow>
				<div>
					<div>Pokemon Images</div>
					<div>
						<input
							type="checkbox"
							role="switch"
							onChange={(ev) => updateImages(ev.target.checked)}
							defaultChecked={appData.settings.images}
						/>
					</div>
				</div>
				<div className="setting-desc">
					<p>If Pokemon images are enabled, they will be sourced from the <em>public/images/pokemon</em> path by default.  Alternatively, a custom path can be configured in the app's <em>.env.local</em> file.</p>
				</div>
			</SettingRow>
			<SettingRow>
				<div>
					<div>Pokemon Images Path</div>
					<div style={{ display: 'flex' }}>
						<input
							type="text"
							placeholder="DEFAULT"
							defaultValue={appData.settings.imagesPath}
							style={{
								borderRadius: '3rem',
								borderColor: '#3ABCA0',
								borderWidth: '2px',
								padding: '1rem 1.5rem',
								marginRight: '1rem'
							}}
							onChange={(ev) => setImagesPath(ev.target.value)}
						/>
						<button
							className="app-like"
							onClick={() => updateImagesPath()}
						>Set</button>
					</div>
				</div>
				<div className="setting-desc">
					<p>Custom URL source for your Pokemon images.  If a custom path is not set, the default images path is <em>public/images/pokemon</em>.</p>
				</div>
			</SettingRow>
		</section>
		<section className="page-block">
			<SettingRow>
				<div>
					<div>Timezone</div>
					<div style={{ display: 'flex' }}>
						<input
							type="text"
							placeholder="DEFAULT"
							defaultValue={appData.settings.timezone}
							style={{
								borderRadius: '3rem',
								borderColor: '#3ABCA0',
								borderWidth: '2px',
								padding: '1rem 1.5rem',
								marginRight: '1rem'
							}}
							onChange={(ev) => setTimezone(ev.target.value)}
						/>
						<button
							className="app-like"
							onClick={() => updateTimezone()}
						>Set</button>
					</div>
				</div>
				<div className="setting-desc">
					<p>For created/modified timestamps on teams, your browser's local timezone will be used.  If that timezone is incorrect or you'd like to set it explicitly, you can specify it here.  Use any <a href="https://timezonedb.com/time-zones" target="_blank">IANA time zone name</a>.</p>
				</div>
			</SettingRow>
		</section>
		<section className="page-block">
			<SettingRow>
				<div>
					<div>Export Data</div>
					<div>
						<a href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData))}
							download="gbl-notebook-data.json"
							className="app-like">
							Export
						</a>
					</div>
				</div>
				<div className="setting-desc">
					<p>Download a JSON file containing all of your stored team and opponent data. This allows you to have a backup in case your browser's local storage is cleared, or if you want to load your data on another browser or device.</p>
				</div>
			</SettingRow>
			<SettingRow>
				<div>
					<div>Import Data</div>
					<div>
						<button className="app-like" onClick={() => fileInputField.current.click()}>Import</button>
						<input type="file"
							ref={fileInputField}
							onChange={handleFileUpload}
							title=""
							value=""
							accept=".json"
							style={{ display: 'none' }}
						/>
					</div>
				</div>
				<div className="setting-desc">
					<p>Import an exported JSON file to load team and opponent data.  This will overwrite any currently stored data.</p>
				</div>
			</SettingRow>
			<SettingRow>
				<div>
					<div>Delete Data</div>
					<div>
						<button
							className="app-like"
							onClick={() => setShowDeleteConfirm(true)}
						>Delete</button>
					</div>
				</div>
				<div className="setting-desc">
					<p>Delete all stored app data, including all teams, opponents and settings.  Deleted data cannot be recovered without an exported backup file.</p>
				</div>
			</SettingRow>
			{showDeleteConfirm &&
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
							onClick={() => deleteAppData()}
							className="filled warning"
						>Delete Data</button>
					</div>
				</ConfirmationBox>
			}
		</section>

		<h3 className="page-heading">About</h3>
		<section className="page-block">
			<p><a href="https://github.com/sambaneko/gbl-notebook" target="_blank">GBL Notebook</a> is an open source fan project by <a href="https://spacecatsamba.com/" target="_blank">sambaneko</a>.  It is intended for non-commercial, personal use and educational purposes.  Pokémon Go is the property of The Pokemon Company and Niantic.  Game data and graphic assets were obtained from the <a href="https://github.com/PokeMiners" target="_blank">PokeMiners</a>.</p>
		</section>
	</section>
}
