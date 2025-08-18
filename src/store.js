import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { createTransform } from 'redux-persist'

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

export const pokemonList = require('./game-data/parsed/pokemon.json')
export const moveList = require('./game-data/parsed/moves.json')
export const leaguesList = require('./game-data/parsed/leagues.json')

const seasonList = require('./game-data/seasons.json')
const allSeasons = seasonList.shift()
seasonList.map(
	(season) => season.cups = [
		...allSeasons.cups,
		...season.cups
	]
)
export { seasonList }

const initialState = {
	version: 1.0,
	cups: {},
	templates: [],
	settings: {
		season: seasonList[0].value,
		images: false,
		imagesPath: null,
		timezone: null,
	},
	lastViewed: null
}

const addImagesSettingTransform = createTransform(
	(inboundState, key) => inboundState,
	(outboundState, key) => {
		if (!outboundState) return outboundState
		return {
			...outboundState,
			settings: {
				...outboundState.settings,
				images: outboundState.settings?.images ?? false
			}
		}
	}
)

const addEnvSettingsTransform = createTransform(
	(inboundState, key) => inboundState,
	(outboundState, key) => {
		if (!outboundState) return outboundState
		return {
			...outboundState,
			settings: {
				...outboundState.settings,
				imagesPath: outboundState.settings?.imagesPath ?? null,
				timezone: outboundState.settings?.timezone ?? null
			}
		}
	}
)

const addLastViewedTransform = createTransform(
	(inboundState, key) => inboundState,
	(outboundState, key) => {
		if (!outboundState) return outboundState
		return {
			...outboundState,
			lastViewed: outboundState.lastViewed ?? null,
		}
	}
)

const persistConfig = {
	key: 'root',
	storage,
	transforms: [addImagesSettingTransform, addEnvSettingsTransform, addLastViewedTransform]
}

const getFormattedDate = (tz) => {
	return (
		new Intl.DateTimeFormat(undefined, {
			...{
				dateStyle: 'short',
				timeStyle: 'short',
				hourCycle: 'h12'
			},
			...(tz !== null ? { timeZone: tz } : {})
		})
	).format(new Date())
}

const getId = (check) => {
	let newId = uuidv4()

	while (
		// eslint-disable-next-line no-loop-func
		check.find(({ id }) => id === newId) !== undefined
	) newId = uuidv4()

	return newId
}

const initCup = {
	teams: [],
	opponents: []
}

const createTeam = (teams, tz) => {
	let date = getFormattedDate(tz)
	return {
		id: getId(teams),
		created: date,
		modified: date,
		mons: [],
		notes: '',
		fave: false
	}
}

export const slice = createSlice({
	name: 'appData',
	initialState,
	reducers: {
		importAppData: (state, action) => {
			if (action.payload === null) {
				return initialState
			}
			return {
				...initialState,
				...action.payload
			}
		},
		updateLastViewed: (state, action) => {
			state.lastViewed = action.payload
		},
		updateSettings: (state, action) => {
			state.settings = {
				...state.settings,
				...action.payload
			}
		},
		updateTeam: (state, action) => {
			let pl = action.payload

			if (state.cups[pl.cup] === undefined)
				state.cups[pl.cup] = { ...initCup }

			let teams = state.cups[pl.cup].teams
			let team = { ...pl.team }

			if (team.id === undefined) {
				team.season = state.settings.season
				state.cups[pl.cup].teams.push({
					...createTeam(teams, state.settings.timezone),
					...team
				})
			} else {
				team.modified = getFormattedDate(state.settings.timezone)
				let i = teams.findIndex(({ id }) => id === team.id)
				state.cups[pl.cup].teams[i] = { ...teams[i], ...team }
			}
		},
		deleteTeam: (state, action) => {
			state.cups[action.payload.cup].current = null

			state.cups[action.payload.cup].teams.splice(
				state.cups[action.payload.cup].teams.findIndex(
					({ id }) => id === action.payload.id
				), 1
			)
		},
		updateCurrent: (state, action) => {
			let currentId = action.payload.id

			if (currentId === null) {
				currentId = (
					state.cups[action.payload.cup].teams[
					state.cups[action.payload.cup].teams.length - 1
					]
				).id
			}

			state.cups[action.payload.cup].current = currentId
		},
		updateTemplates: (state, action) => {
			let pl = action.payload

			if (!Array.isArray(pl)) pl = [pl]

			pl.map((template) =>
				template.templateIndex === null
					? state.templates.push({
						...template.pokemon
					})
					: state.templates[template.templateIndex] = {
						...state.templates[template.templateIndex],
						...template.pokemon
					}
			)
		},
		updateTeamMember: (state, action) => {
			let pl = action.payload
			let teams = state.cups[pl.cup].teams

			if (pl.id === null) {
				let team = createTeam(teams, state.settings.timezone)
				team = {
					...team,
					season: pl.season
				}
				team.mons[pl.memberIndex] = {
					...pl.member
				}
				state.cups[pl.cup].teams.push(team)
				state.cups[pl.cup].current = team.id
			} else {
				let i = teams.findIndex(({ id }) => id === pl.id)
				state.cups[pl.cup].teams[i].mons[pl.memberIndex] = {
					...teams[i].mons[pl.memberIndex],
					...pl.member
				}
				state.cups[pl.cup].teams[i].modified = getFormattedDate(state.settings.timezone)
			}
		},
		moveTeamMember: (state, action) => {
			let pl = action.payload
			let newPos = pl.memberIndex + pl.dir

			let i = state.cups[pl.cup].teams.findIndex(
				({ id }) => id === pl.id
			)

			state.cups[pl.cup].teams[i].mons.splice(
				newPos, 0,
				state.cups[pl.cup].teams[i].mons.splice(
					pl.memberIndex, 1
				)[0]
			)
		},
		removeTeamMember: (state, action) => {
			let pl = action.payload
			let i = state.cups[pl.cup].teams.findIndex(
				({ id }) => id === pl.id
			)
			state.cups[pl.cup].teams[i].mons.splice(
				pl.memberIndex, 1
			)
		},
		updateOpponent: (state, action) => {
			let pl = action.payload

			if (state.cups[pl.cup] === undefined)
				state.cups[pl.cup] = { ...initCup }
			
			let opponents = state.cups[pl.cup].opponents

			if (
				pl.member.id === null ||
				pl.member.id === undefined
			) {
				state.cups[pl.cup].opponents.push({
					...pl.member,
					season: pl.season,
					id: getId(opponents)
				})
			} else {
				let i = opponents.findIndex(({ id }) => id === pl.member.id)
				state.cups[pl.cup].opponents[i] = {
					...opponents[i],
					...pl.member
				}
			}
		},
		moveOpponent: (state, action) => {
			let pl = action.payload
			let opponents = state.cups[pl.cup].opponents

			// filter set
			const seasonSet = opponents.filter(
				({ season }) => season === pl.season
			)

			// get index of id in filtered set
			const index = seasonSet.findIndex(({ id }) => id === pl.id)

			// calc new index
			const newIndex = index + pl.dir

			// proceed if within bounds
			if (newIndex >= 0 && newIndex < seasonSet.length) {
				// remove from original index in the full set
				const [moveOpp] = state.cups[pl.cup].opponents.splice(
					opponents.findIndex(({ id }) => id === pl.id), 1
				)

				// get index of item in the full set that matches
				// where the moving item should go (before or after it) 
				const targetIndex = opponents.findIndex(
					({ season, id }) =>
						season === pl.season &&
						id === seasonSet[newIndex].id
				)

				// insert at new position
				state.cups[pl.cup].opponents.splice(
					targetIndex + (pl.dir < 0 ? 0 : 1), 0, moveOpp
				)
			}
		},
		removeOpponent: (state, action) => {
			let pl = action.payload
			state.cups[pl.cup].opponents.splice(
				state.cups[pl.cup].opponents.findIndex(
					({ id }) => id === pl.id
				), 1
			)
		},
		importOpponents: (state, action) => {
			let pl = action.payload
			let opponents = state.cups[pl.cup].opponents

			if (opponents.length <= 0) return

			let previousSeasons = (opponents.map(({ season }) => season))
				.sort((a, b) => b - a)
				.filter((n) => n < pl.season)

			if (previousSeasons.length <= 0) return

			let toImport = opponents.filter(
				({ season }) => parseInt(season) ===
					parseInt(previousSeasons[0])
			)
			toImport.map((opponent) =>
				state.cups[pl.cup].opponents.push({
					...opponent,
					season: pl.season,
					id: getId(state.cups[pl.cup].opponents)
				})
			)
		}
	}
})

export const {
	importAppData,
	updateSettings,
	updateLastViewed,
	updateTeam,
	deleteTeam,
	updateCurrent,
	updateTemplates,
	updateTeamMember,
	moveTeamMember,
	removeTeamMember,
	updateOpponent,
	moveOpponent,
	removeOpponent,
	importOpponents
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