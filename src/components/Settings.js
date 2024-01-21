import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { importAppData } from '../store'
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
		dispatch(importAppData({}))
	}

	useEffect(() => {
		if (myState === 'deleting') {
			setShowDeleteConfirm(false)
			setMyState(null)
		}
	}, [appData])

	const SettingRow = styled.div`
		display: flex;
		margin-bottom: 3rem;
		& > *:first-child {
			width: 13rem;
			flex-shrink: 0;
		}
		& > *:last-child {
			padding-left: 2rem;
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

	return <>
		<h3 style={{ textAlign: 'center', marginBottom: '3rem' }}>Settings</h3>

		<SettingRow>
			<div>
				<a href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData))}
					download="gbl-notebook-data.json"
					className="app-like">
					Export Data
				</a>
			</div>
			<div>
				<p>Download a JSON file containing all of your stored team and opponent data. This allows you to have a backup in case your browser's local storage is cleared, or if you want to load your data on another browser or device.</p>
			</div>
		</SettingRow>
		<SettingRow>
			<div>
				<button className="app-like" onClick={() => fileInputField.current.click()}>Import Data</button>
				<input type="file"
					ref={fileInputField}
					onChange={handleFileUpload}
					title=""
					value=""
					accept=".json"
					style={{ display: 'none' }}
				/>
			</div>
			<div>
				<p>Import an exported JSON file to load team and opponent data.  This will overwrite any currently stored data.</p>
			</div>
		</SettingRow>
		<SettingRow>
			<div><button className="app-like" onClick={() => setShowDeleteConfirm(true)}>Delete Data</button></div>
			<div>
				<p>Delete all of your currently stored team and opponent data.  Deleted data cannot be recovered without an exported backup file.</p>
			</div>
		</SettingRow>
		{showDeleteConfirm &&
			<ConfirmationBox>
				<div style={{margin: 'auto 0'}}>
					<p>Are you sure?</p>
				</div>
				<div style={{marginLeft: 'auto'}}>
					<button
						onClick={() => setShowDeleteConfirm(false)}
						className="outlined"
						style={{marginRight: '1rem'}}
					>Cancel</button>
					<button
						onClick={() => deleteAppData()}
						className="filled warning"
					>Delete Data</button>
				</div>
			</ConfirmationBox>
		}
	</>
}
