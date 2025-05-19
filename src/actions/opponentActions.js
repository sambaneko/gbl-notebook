import {
	updateTemplates,
	updateOpponent,
	moveOpponent,
	removeOpponent,
	importOpponents
} from '../store'

export const opponentActions = {
	update: (args) => {
		args.dispatch(
			updateOpponent({
				member: args.data.member,
				cup: args.cup,
				season: args.season
			})
		)

		if (args.data?.templates !== undefined)
			args.dispatch(
				updateTemplates(args.data.templates)
			)
	},

	move: (args) => args.dispatch(
		moveOpponent({
			cup: args.cup,
			season: args.season,
			id: args.id,
			dir: args.dir
		})
	),

	remove: (args) => args.dispatch(
		removeOpponent({ cup: args.cup, id: args.id })
	),

	import: (args) => args.dispatch(
		importOpponents({ cup: args.cup, season: args.season })
	),
}
