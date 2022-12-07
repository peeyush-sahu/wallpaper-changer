import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import timeZones, { Timezone } from 'timezones.json';
import { useSelector, useDispatch } from 'react-redux';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ScrollView,
	Animated,
	Dimensions,
} from 'react-native';

import { store, RootState } from './store';
import { setTimezone } from './store/reducers/home';

const { height } = Dimensions.get('window');
const wallpaper = [
	'https://images.unsplash.com/photo-1571080648416-3fda23702c51?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
	'https://images.unsplash.com/photo-1608825090252-a2163590fe08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
	'https://images.unsplash.com/photo-1561915573-b78892da34b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
	'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
];

const AppContainer = () => {
	const dispatch = useDispatch();
	const { currentTimeZone, status } = useSelector(
		(state: RootState) => state.home
	);
	const slideAnim = React.useRef<Animated.Value>(
		new Animated.Value(0)
	).current;

	const getTimeZone = () => {
		let deviceTimeZoneOffset = new Date().getTimezoneOffset() / 60;
		deviceTimeZoneOffset =
			deviceTimeZoneOffset < 0
				? Math.abs(deviceTimeZoneOffset)
				: -deviceTimeZoneOffset;
		const timeZone = timeZones.filter(
			tz => tz.offset === deviceTimeZoneOffset
		)[0];

		dispatch(setTimezone(timeZone));
	};

	const setTimeZone = (tz: Timezone) => {
		dispatch(setTimezone(tz));
		slideOut();
	};

	React.useEffect(() => {
		getTimeZone();
	}, []);

	const slideIn = () => {
		Animated.timing(slideAnim, {
			toValue: height * 0.9,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	const slideOut = () => {
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	return (
		<View style={styles.container}>
			<StatusBar style='light' />

			<Image
				resizeMode='cover'
				style={styles.wallpaper}
				source={{
					uri: wallpaper[status],
				}}
			/>
			<TouchableOpacity
				style={styles.fab}
				activeOpacity={0.5}
				onPress={slideIn}
			>
				<Text style={styles.fabText}>Choose Timezone</Text>
				<Text style={styles.fabCurrentText}>
					{currentTimeZone?.text}
				</Text>
			</TouchableOpacity>

			<Animated.View
				style={[styles.timeZonePicker, { height: slideAnim }]}
			>
				<TouchableOpacity style={styles.close} onPress={slideOut}>
					<Text>&#x2716;</Text>
				</TouchableOpacity>
				<ScrollView contentContainerStyle={styles.pickerScrollView}>
					{timeZones.map((timeZone, index) => (
						<TouchableOpacity
							key={index}
							activeOpacity={0.75}
							onPress={() => setTimeZone(timeZone)}
						>
							<Text style={styles.timeText}>
								{timeZone.value}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</Animated.View>
		</View>
	);
};

const App = () => {
	return (
		<Provider store={store}>
			<AppContainer />
		</Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},

	close: {
		backgroundColor: '#ffffff',
		width: 40,
		height: 40,
		alignSelf: 'flex-end',
		borderRadius: 40,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: 20,
		top: 20,
		zIndex: 4,
	},

	pickerScrollView: {
		paddingVertical: 40,
	},

	timeText: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '600',
		paddingHorizontal: 20,
		paddingVertical: 10,
		textAlign: 'center',
	},

	timeZonePicker: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 3,
		backgroundColor: 'rgba(0, 0, 0, 0.85)',
		elevation: 4,
	},

	fab: {
		position: 'absolute',
		bottom: 80,
		zIndex: 2,
		borderRadius: 30,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		height: 50,
		paddingHorizontal: 16,
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		minWidth: 200,
	},

	fabCurrentText: {
		fontSize: 12,
		textAlign: 'center',
	},

	fabText: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},

	wallpaper: {
		height: '100%',
		width: '100%',
	},

	topBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 120,
		zIndex: 1,
	},

	bottomBackground: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 100,
		zIndex: 1,
	},
});

export default App;
