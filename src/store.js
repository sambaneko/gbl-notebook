import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import { v4 as uuidv4 } from 'uuid'

const persistConfig = { key: 'root', storage }
const intlDtFormat = new Intl.DateTimeFormat(undefined, {
	...{
		dateStyle: 'short',
		timeStyle: 'short',
		hourCycle: 'h12'
	},
	...(process.env.REACT_APP_USE_TZ !== ''
		? { timeZone: process.env.REACT_APP_USE_TZ }
		: {}
	)
})

export const defaultCup = {
	teams: [{ mons: [], notes: '' }],
	opponents: [],
	currentTeam: 0
}

export const pokemonList = require('./game-data/parsed/pokemon.json')
export const moveList = require('./game-data/parsed/moves.json')
export const leaguesList = require('./game-data/parsed/leagues.json')
export const seasonList = require('./game-data/seasons.json')

const getId = (check) => {
	let newId = uuidv4()

	while (
		check.find(
			({ id }) => id == newId
		) !== undefined
	) {
		newId = uuidv4()
	}

	return newId
}

const createTeam = (teams) => {
	let date = intlDtFormat.format(new Date())
	return {
		id: getId(teams),
		created: date,
		modified: date,
		mons: [],
		notes: ''
	}
}

const setCurrent = (current, pick) => {
	let updated = false

	current = current.map((me) => {
		if (
			me.cup == pick.cup &&
			me.season == pick.season
		) {
			me = { ...pick }
			updated = true
		}
		return me
	})

	if (!updated) current.push(pick)

	return current
}

const initialState = {
	teams: [],
	templates: [],
	opponents: [],
	current: [],
	faves: []
}

export const slice = createSlice({
	name: 'appData',
	initialState,
	reducers: {
		importAppData: (state, action) => {
			if (action.payload === null) {
				return initialState
			}
			return { ...action.payload }
		},
		saveTeam: (state, action) => {
			let team = { ...action.payload }

			if (team.id === undefined) {
				state.teams.push({
					...createTeam(state.teams),
					...team
				})
			} else {
				team.modified = intlDtFormat.format(new Date())
				let i = state.teams.findIndex(({ id }) => id == team.id)
				state.teams[i] = { ...state.teams[i], ...team }
			}
		},
		deleteTeam: (state, action) => {
			state.current.splice(
				state.current.findIndex(
					({ id }) => id == action.payload
				), 1
			)
			state.teams.splice(
				state.teams.findIndex(
					({ id }) => id == action.payload
				), 1
			)
		},
		updateFave: (state, action) => {
			// only one fave is allowed per season/cup
			let fave = { ...action.payload }
			let i = state.faves.findIndex(
				me => me.cup == fave.cup && me.season == fave.season
			)

			if (i > -1) {
				if (state.faves[i].id == fave.id) {
					state.faves.splice(i, 1)
				} else {
					state.faves[i] = fave
				}
			} else {
				state.faves.push(fave)
			}
		},
		updateCurrent: (state, action) => {
			state.current = [
				...setCurrent(
					state.current,
					{ ...action.payload }
				)
			]
		},
		updateTemplate: (state, action) => {
			if (action.payload.templateIndex === null) {
				state.templates.push({
					...action.payload.pokemon
				})
			} else {
				state.templates[action.payload.templateIndex] = {
					...state.templates[action.payload.templateIndex],
					...action.payload.pokemon
				}
			}
		},
		updateTeamMember: (state, action) => {
			if (action.payload.id === null) {
				let team = createTeam(state.teams)
				team = {
					...team,
					...action.payload.team
				}
				team.mons[action.payload.teamIndex] = {
					...action.payload.pokemon
				}
				state.teams.push(team)

				state.current = [
					...setCurrent(
						state.current,
						{
							...action.payload.team,
							id: team.id
						}
					)
				]
			} else {
				let i = state.teams.findIndex(
					team => team.id == action.payload.id
				)

				state.teams[i] = {
					...state.teams[i],
					...action.payload.team
				}

				state.teams[i].mons[action.payload.teamIndex] = {
					...state.teams[i].mons[action.payload.teamIndex],
					...action.payload.pokemon
				}
				state.teams[i].modified = intlDtFormat.format(new Date())
			}
		},
		moveTeamMember: (state, action) => {
			let newPos = action.payload.teamIndex + action.payload.dir
			let i = state.teams.findIndex(
				({ id }) => id == action.payload.id
			)
			state.teams[i].mons.splice(
				newPos, 0,
				state.teams[i].mons.splice(
					action.payload.teamIndex, 1
				)[0]
			)
		},
		removeTeamMember: (state, action) => {
			let i = state.teams.findIndex(
				({ id }) => id == action.payload.id
			)
			state.teams[i].mons.splice(
				action.payload.teamIndex, 1
			)
		},
		updateOpponent: (state, action) => {
			if (action.payload.id === null) {
				state.opponents.push({
					...action.payload,
					id: getId(state.opponents)
				})
			} else {
				let i = state.opponents.findIndex(
					({ id }) => id == action.payload.id
				)
				state.opponents[i] = {
					...state.opponents[i],
					...action.payload
				}
			}
		},
		moveOpponent: (state, action) => {
			let args = { ...action.payload }

			// filter set
			const cupSet = state.opponents.filter(
				({ season, cup }) => season == args.season && cup == args.cup
			)

			// get index of id in filtered set
			const index = cupSet.findIndex(({ id }) => id == args.id)

			// calc new index
			const newIndex = index + args.dir

			// proceed if within bounds
			if (newIndex >= 0 && newIndex < cupSet.length) {

				// remove from original index in the full set
				const [moveOpp] = state.opponents.splice(
					state.opponents.findIndex(({ id }) => id == args.id), 1
				)

				// get index of item in the full set that matches
				// where the moving item should go (before or after it) 
				const targetIndex = state.opponents.findIndex(
					({ season, cup, id }) =>
						season == args.season &&
						cup == args.cup &&
						id === cupSet[newIndex].id
				)

				// insert at new position
				state.opponents.splice(
					targetIndex + (args.dir < 0 ? 0 : 1), 0, moveOpp
				)
			}
		},
		removeOpponent: (state, action) => {
			state.opponents.splice(
				state.opponents.findIndex(
					({ id }) => id == action.payload
				), 1
			)
		}
	}
})

export const {
	importAppData,
	saveTeam,
	deleteTeam,
	updateFave,
	updateCurrent,
	updateTemplate,
	updateTeamMember,
	moveTeamMember,
	removeTeamMember,
	updateOpponent,
	moveOpponent,
	removeOpponent
} = slice.actions

const userReducer = combineReducers({ appData: slice.reducer })

const persistedReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		})
})

export const persistor = persistStore(store)

export default store