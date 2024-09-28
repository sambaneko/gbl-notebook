//note: this became obsolete after season rearrangement
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import { updateTeam, seasonList } from '../store'

export default function TeamDataEditor({
	cupId, teamId, selectedSeason
}) {
	const dispatch = useDispatch()

	return <div>
		<Select
			options={seasonList}
			onChange={(selectedOpt) => {
				dispatch(updateTeam({
					cup: cupId,
					teamIndex: teamId,
					team: { season: selectedOpt.value }
				}))
			}}
			defaultValue={selectedSeason}
		/>
	</div>
}
