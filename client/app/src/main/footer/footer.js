import {StyleSheet, View} from "react-native";
import {useLocation, useNavigate} from "react-router-native";
import {IconButton} from "react-native-paper";
import {useEffect, useState} from "react";

const buttonsConfig = [
	{
		iconName: 'home',
		path: '/main'
	},
	{
		iconName: 'plus',
		path: '/create',
		noOutline: true
	},
	{
		iconName: 'account',
		path: '/account'
	}
]

export default function AppFooter() {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<View style={styles.footerContainer}>
			{buttonsConfig.map((e, i) => {
				return (
					<View key={i} style={{...styles.buttonView, backgroundColor: location.pathname === e.path ? '#2e2e31' : 'transparent'}}>
						<IconButton
							key={i}
							iconColor='white'
							size={32}
							icon={`${e.iconName}${location.pathname !== e.path && !e.noOutline ? '-outline' : ''}`}
							onPress={() => {
								navigate(e.path)
							}}
						/>
					</View>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	footerContainer: {
		width: '100%',
		height: '10%',
		position: 'absolute',
		backgroundColor: '#121313',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopWidth: 2,
		borderTopColor: '#474749',
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex',
		flexDirection: 'row'
	},
	buttonView: {
		borderRadius: 50,
		marginLeft: 'auto',
		marginRight: 'auto'
	}
});
