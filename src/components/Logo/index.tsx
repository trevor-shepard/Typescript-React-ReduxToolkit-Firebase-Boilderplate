import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { logo } from 'assets/images'
const Component: FunctionComponent = () => {
	return <Logo src={logo} />
}

const Logo = styled.img`
	position: absolute;
	width: 51px;
	height: 39px;
	left: 2%;
	top: 2%;
`

export default Component
