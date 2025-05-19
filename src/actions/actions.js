import { teamActions } from './teamActions'
import { opponentActions } from './opponentActions'

export default class actions {
	constructor() {
		this.dispatch = null
		this.cup = null
		this.season = null
		this.teamActions = teamActions
		this.opponentActions = opponentActions
	}

	provideDispatch = (dispatch) => {
		this.dispatch = dispatch
	}

	updateContext = ({ cup, season }) => {
		this.cup = cup
		this.season = season
	}

	doAction = (actionGroup, actionName, args) => {
		if (typeof this[actionGroup][actionName] === 'function') {
			return this[actionGroup][actionName]({
				dispatch: this.dispatch,
				cup: this.cup,
				season: this.season,
				...args
			})
		}
		throw new Error(`${actionGroup} ${actionName} not found`)
	}

	doTeamAction = (actionName, args) =>
		this.doAction('teamActions', actionName, args)

	doOpponentAction = (actionName, args) =>
		this.doAction('opponentActions', actionName, args)

}
