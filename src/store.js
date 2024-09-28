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

const persistConfig = { key: 'root', storage }
const intlDtFormat = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'short',
	timeStyle: 'short',
	hourCycle: 'h12',
	timeZone: process.env.REACT_APP_USE_TZ
})

export const defaultCup = {
	teams: [{ mons: [], notes: '' }],
	opponents: [],
	currentTeam: 0
}

export const leagues = require('./game-data/parsed/leagues.json')
export const leaguesList = require('./game-data/parsed/leagues.json')
export const pokemonList = require('./game-data/parsed/pokemon.json')
export const moveList = require('./game-data/parsed/moves.json')

export const currentSeason = 20 // manual update
export const seasonList = require('./game-data/seasons.json')
export const defaultSeasonCups = [
	"COMBAT_LEAGUE_DEFAULT_GREAT",
	"COMBAT_LEAGUE_DEFAULT_ULTRA",
	"COMBAT_LEAGUE_DEFAULT_MASTER"
] 

export const slice = createSlice({
	name: 'appData',
	initialState: { seasons: {}, cups: {}, templates: [] },
	reducers: {
		importAppData: (state, action) => {
			return { ...action.payload }
		},
		addTeam: (state, action) => {
			//updated
			let seasonId = action.payload.season
			if (state.seasons[seasonId] === undefined) {
				state.seasons[seasonId] = {
					cups: {
						[cupId]: { ...defaultCup }
					}
				}
			}

			if (state.seasons[seasonId].cups[action.payload.cup] === undefined) {
				state.seasons[seasonId].cups[action.payload.cup] = { ...defaultCup }
			}

			let cupId = action.payload.cup
			if (state.cups[cupId] === undefined) {
				state.cups[cupId] = { ...defaultCup }
			}

			let team = {...action.payload.team}
			team.created = intlDtFormat.format(new Date())
			team.modified = intlDtFormat.format(new Date())
			team.season = currentSeason

			state.cups[cupId].teams.push(team)
			state.cups[cupId].currentTeam = state.cups[cupId].teams.length - 1

			state.seasons[seasonId].cups[cupId].teams.push(team)
			state.seasons[seasonId].cups[cupId].currentTeam = state.seasons[seasonId].cups[cupId].teams.length - 1
		},
		updateTeam: (state, action) => {
			//updated
			let team = {...action.payload.team}
			team.modified = intlDtFormat.format(new Date())

			if (team?.fave) {
				for (const i in state.cups[action.payload.cup].teams) {
					state.cups[action.payload.cup].teams[i] = {
						...state.cups[action.payload.cup].teams[i],
						fave: false
					}
				}
			}

			state.seasons[action.payload.season].cups[action.payload.cup].teams[action.payload.teamIndex] = {
				...state.seasons[action.payload.season].cups[action.payload.cup].teams[action.payload.teamIndex],
				...team
			}
		},
		deleteTeam: (state, action) => {
			//todo
			if (
				state.cups[action.payload.cup].currentTeam ==
				action.payload.teamIndex &&
				action.payload.teamIndex >= 1
			) {
				state.cups[action.payload.cup].currentTeam = action.payload.teamIndex - 1
			}

			state.cups[action.payload.cup].teams.splice(action.payload.teamIndex, 1)
		},
		updateCurrentTeam: (state, action) => {
			//updated
			//state.cups[action.payload.cup].currentTeam = action.payload.teamIndex
			state.seasons[action.payload.season].cups[action.payload.cup].currentTeam = action.payload.teamIndex
		},
		updatePokemon: (state, action) => {
			//updated
			let seasonId = action.payload.season
			if (state.seasons[seasonId] === undefined) {
				console.log('here')
				state.seasons[seasonId] = {
					cups: {
						[action.payload.cup]: { ...defaultCup }
					}
				}
			}

			if (state.seasons[seasonId].cups[action.payload.cup] === undefined) {
				state.seasons[seasonId].cups[action.payload.cup] = { ...defaultCup }
			}

			if (state.cups[action.payload.cup] === undefined) {
				state.cups[action.payload.cup] = { ...defaultCup }
			}

			if (action.payload.teamIndex !== null) {
				if (action.payload.saveTemplate) {
					if (action.payload.templateIndex === null) {
						state.templates.push({
							...action.payload.pokemon,
							templateType: 'team'
						})
					} else {
						state.templates[action.payload.templateIndex] = {
							...state.templates[action.payload.templateIndex],
							...action.payload.pokemon
						}
					}
				}

				state.seasons[seasonId].cups[action.payload.cup].teams[action.payload.teamIndex].mons[action.payload.monIndex] = {
					...state.seasons[seasonId].cups[action.payload.cup].teams[action.payload.teamIndex].mons[action.payload.monIndex],
					...action.payload.pokemon
				}

				state.seasons[seasonId].cups[action.payload.cup].teams[action.payload.teamIndex].modified = intlDtFormat.format(new Date())

			} else {
				if (action.payload.saveTemplate) {
					if (action.payload.templateIndex === null) {
						state.templates.push({
							...action.payload.pokemon,
							templateType: 'oppo'
						})
					} else {
						state.templates[action.payload.templateIndex] = {
							...state.templates[action.payload.templateIndex],
							...action.payload.pokemon
						}
					}
				}

				if (action.payload.monIndex !== null) {
					state.seasons[seasonId].cups[action.payload.cup].opponents[action.payload.monIndex] = {
						...state.seasons[seasonId].cups[action.payload.cup].opponents[action.payload.monIndex],
						...action.payload.pokemon,
						season: action.payload.season
					}
				} else {
					state.seasons[seasonId].cups[action.payload.cup].opponents.push({
						...action.payload.pokemon,
						season: action.payload.season
					})
				}
			}
		},
		removePokemon: (state, action) => {
			//updated
			if (action.payload.teamIndex !== null) {
				state.seasons[action.payload.season].cups[action.payload.cup].teams[action.payload.teamIndex].mons.splice(action.payload.monIndex, 1)
			} else {
				state.seasons[action.payload.season].cups[action.payload.cup].opponents.splice(action.payload.monIndex, 1)
			}
		},
		rearrangePokemon: (state, action) => {
			//updated
			let newPosition = action.payload.monIndex + action.payload.direction

			if (action.payload.teamIndex !== null) {
				state.seasons[action.payload.season].cups[action.payload.cup].teams[action.payload.teamIndex].mons.splice(
					newPosition, 0,
					state.seasons[action.payload.season].cups[action.payload.cup].teams[action.payload.teamIndex].mons.splice(
						action.payload.monIndex, 1
					)[0]
				)
			} else {
				state.seasons[action.payload.season].cups[action.payload.cup].opponents.splice(
					newPosition, 0,
					state.seasons[action.payload.season].cups[action.payload.cup].opponents.splice(
						action.payload.monIndex, 1
					)[0]
				)
			}
		}
	}
})

export const {
	importAppData,
	addTeam,
	updateTeam,
	updateCurrentTeam,
	deleteTeam,
	updatePokemon,
	removePokemon,
	rearrangePokemon
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