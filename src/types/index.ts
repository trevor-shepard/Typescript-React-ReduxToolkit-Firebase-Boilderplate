export interface User {
	username: string
	uid: string
	email: string
	photo?: string
}

export interface UserState {
	username?: string | null
	uid?: string | null
	email?: string | null
	photo?: string | null
	error: string | null
}

export interface UserWithoutId {
	username: string
	email: string
}

export interface UserUpdate {
	username?: string
	photo?: string
}

export interface Votes {
	[uid: string]: number
}

export interface Group {
	id: string
	name: string
	members: string[]
	locked: {
		[uid: string]: boolean
	}
	activities: {
		// verb$unit (spaces are _)
		[action: string]: Votes
	}
	icons: {
		// verb$unit (spaces are _)
		[action: string]: Icons
	}
}

export interface GroupsState {
	[id: string]: Group
}

export interface Action {
	date: number
	name: string
	quantity: number
	photo?: string | null
	uid: string
	id: string
}

export interface MemberActions {
	[id: string]: Action
}

export interface Member {
	username: string
	uid: string
	email: string
	photo?: string
	actions: MemberActions
}

export interface MembersState {
	[uid: string]: Member
}

export type Icons =
	| 'run'
	| 'apple'
	| 'beer'
	| 'bread'
	| 'dance'
	| 'drink'
	| 'fastfood'
	| 'heart'
	| 'mentalhealth'
	| 'poison'
	| 'run'
	| 'sleep'
	| 'tv'
	| 'yoga'
