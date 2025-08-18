import {
	updateTeam,
	duplicateTeam,
	deleteTeam,
	updateTeamMember,
	moveTeamMember,
	removeTeamMember,
	updateTemplates,
	updateCurrent
} from '../store'

export const teamActions = {
	update: (args) => {
		args.dispatch(
			updateTeam({
				cup: args.cup,
				team: args.data.team
			})
		)

		if (args.data?.templates !== undefined)
			args.dispatch(
				updateTemplates(args.data.templates)
			)

		if (args.data.team.id === undefined)
			teamActions.switch(args)
	},

	duplicate: (args) => args.dispatch(
		duplicateTeam({
			cup: args.cup,
			id: args.id
		})
	),

	delete: (args) => args.dispatch(
		deleteTeam({
			cup: args.cup,
			id: args.id
		})
	),

	switch: (args) => {
		args.dispatch(
			updateCurrent({
				cup: args.cup,
				id: args?.id || null
			})
		)
	},

	updateMember: (args) => {
		args.dispatch(
			updateTeamMember({
				cup: args.cup,
				season: args.season,
				id: args.id,
				memberIndex: args.memberIndex,
				member: args.data.member
			})
		)

		if (args.data?.templates !== undefined)
			args.dispatch(
				updateTemplates(args.data.templates)
			)
	},

	moveMember: (args) => args.dispatch(
		moveTeamMember({
			cup: args.cup,
			id: args.id,
			memberIndex: args.memberIndex,
			dir: args.dir
		})
	),

	removeMember: (args) => args.dispatch(
		removeTeamMember({
			cup: args.cup,
			id: args.id,
			memberIndex: args.memberIndex
		})
	)
}
