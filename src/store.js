import { configureStore, createSlice, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import localforage from 'localforage'

export const defaultCup = {
	teams: [{ mons: [], notes: '' }],
	opponents: [],
	currentTeam: 0
}

export const leagues = require('./game-data/parsed/leagues.json')
export const pokemonList = require('./game-data/parsed/pokemon.json')
export const moveList = require('./game-data/parsed/moves.json')

export const slice = createSlice({
	name: 'appData',
	initialState: await localforage.getItem('appData') || {},
	reducers: {
		importAppData: (state, action) => {
			return { ...action.payload }
		},
		addTeam: (state, action) => {
			if (state[action.payload.cup] === undefined) {
				state[action.payload.cup] = { ...defaultCup }
			}

			state[action.payload.cup].teams.push(action.payload.team)
			state[action.payload.cup].currentTeam =
				state[action.payload.cup].teams.length - 1
		},
		updateTeam: (state, action) => {
			state[action.payload.cup].teams[action.payload.teamIndex] = {
				...state[action.payload.cup].teams[action.payload.teamIndex],
				...action.payload.team
			}
		},
		updateCurrentTeam: (state, action) => {
			state[action.payload.cup].currentTeam = action.payload.teamIndex
		},
		addOpponent: (state, action) => {
			if (state[action.payload.cup] === undefined) {
				state[action.payload.cup] = { ...defaultCup }
			}

			state[action.payload.cup].opponents.push(action.payload.opponent)
		},
		updatePokemon: (state, action) => {
			if (state[action.payload.cup] === undefined) {
				state[action.payload.cup] = { ...defaultCup }
			}

			if (action.payload.teamIndex !== null) {
				state[action.payload.cup].teams[action.payload.teamIndex].mons[action.payload.monIndex] = {
					...state[action.payload.cup].teams[action.payload.teamIndex].mons[action.payload.monIndex],
					...action.payload.pokemon
				}
			} else {
				state[action.payload.cup].opponents[action.payload.monIndex] = {
					...state[action.payload.cup].opponents[action.payload.monIndex],
					...action.payload.pokemon
				}
			}
		},
		removePokemon: (state, action) => {
			if (action.payload.teamIndex !== null) {
				state[action.payload.cup].teams[action.payload.teamIndex].mons.splice(action.payload.monIndex, 1)
			} else {
				state[action.payload.cup].opponents.splice(action.payload.monIndex, 1)
			}
		},
		rearrangePokemon: (state, action) => {
			let newPosition = action.payload.monIndex + action.payload.direction

			if (action.payload.teamIndex !== null) {
				state[action.payload.cup].teams[action.payload.teamIndex].mons.splice(
					newPosition, 0,
					state[action.payload.cup].teams[action.payload.teamIndex].mons.splice(
						action.payload.monIndex, 1
					)[0]
				)
			} else {
				state[action.payload.cup].opponents.splice(
					newPosition, 0,
					state[action.payload.cup].opponents.splice(
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
	updatePokemon,
	addOpponent,
	removePokemon,
	rearrangePokemon
} = slice.actions

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
	matcher: isAnyOf(
		importAppData,
		addTeam,
		updateTeam,
		updateCurrentTeam,
		updatePokemon,
		addOpponent,
		removePokemon,
		rearrangePokemon
	),
	effect: async (action, listenerApi) => {
		const theState = listenerApi.getState()
		localforage.setItem('appData', { ...theState.appData })
	}
})

const store = configureStore({
	reducer: {
		appData: slice.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})

export default store