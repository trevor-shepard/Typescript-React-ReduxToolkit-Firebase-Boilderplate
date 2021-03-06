import React, {
	FunctionComponent,
	useEffect,
	useState,
	Dispatch,
	SetStateAction
} from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { Group, Action, Icons } from 'types'
import FeedListItem from './FeedListItem'
import Photo from './Photo'

import { useDispatch } from 'react-redux'
import { subscribeToMember } from 'store/slices/membersSlice'

interface Props {
	groupID: string
	setGroupID: Dispatch<SetStateAction<string>>
}

const Feed: FunctionComponent<Props> = ({ groupID, setGroupID }) => {
	const dispatch = useDispatch()
	const allMembers = useSelector((state: RootState) => state.members)
	const groups = useSelector((state: RootState) => state.groups)
	const group = groups[groupID] as Group
	const [photo, setPhoto] = useState('')
	const [actionValues, setActionValues] = useState<{
		[name: string]: {
			[groupID: string]: number
		}
	}>({})

	const [actionIcons, setActionIcons] = useState<{
		[name: string]: Icons
	}>({})

	useEffect(() => {
		const firstGroup = Object.values(groups)[0]

		if (firstGroup && groupID === '') setGroupID(firstGroup.id)
	}, [groups, groupID, setGroupID])

	useEffect(() => {
		const actionGroupValues: {
			[name: string]: {
				[groupID: string]: number
			}
		} = {}
		for (const group of Object.values(groups)) {
			const { id, activities } = group

			for (const name of Object.keys(activities)) {
				const votes = activities[name]
				const score =
					Object.values(votes).reduce((acc, curr) => acc + curr) /
					Object.values(votes).length

				actionGroupValues[name]
					? (actionGroupValues[name] = {
							...actionGroupValues[name],
							[id]: score
					  })
					: (actionGroupValues[name] = { [id]: score })
			}
		}
		setActionValues(actionGroupValues)
	}, [groups])

	useEffect(() => {
		if (groupID === '') {
			const groupActionIcons: {
				[name: string]: Icons
			} = {}
			for (const group of Object.values(groups)) {
				const { icons } = group

				for (const name of Object.values(icons)) {
					groupActionIcons[name] = icons[name]
				}
			}

			setActionIcons(groupActionIcons)
		} else {
			const group = groups[groupID]

			if (group) setActionIcons(group.icons)
		}
	}, [groupID, groups])

	useEffect(() => {
		const unsubscribes: (() => void)[] = []
		for (const uid of Object.keys(allMembers)) {
			unsubscribes.push(subscribeToMember(dispatch, uid))
		}

		return () => {
			for (const unsubscribe of unsubscribes) {
				unsubscribe()
			}
		}
	}, [dispatch, allMembers])

	const actions = Object.keys(allMembers)
		.reduce((acc: Action[], uid) => {
			if (!group) return [...acc, ...Object.values(allMembers[uid].actions)]
			if (group && group.members.includes(uid))
				return [...acc, ...Object.values(allMembers[uid].actions)]
			return acc
		}, [])
		.sort((a, b) => b.date - a.date)
		.map((action, i) => (
			<FeedListItem
				groupValues={actionValues[action.name] ? actionValues[action.name] : {}}
				icon={actionIcons[action.name]}
				action={action}
				member={allMembers[action.uid]}
				key={`${i}-feed-list-item`}
				setPhoto={setPhoto}
			/>
		))

	return (
		<Container>
			{photo !== '' ? <Photo setPhoto={setPhoto} photo={photo} /> : actions}
		</Container>
	)
}

const Container = styled.div`
	padding-top: 65px;
	flex-direction: column;
	height: 100%;
	overflow: scroll;
	padding-bottom: 59px;
`

export default Feed
