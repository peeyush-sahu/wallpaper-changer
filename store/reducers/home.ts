import moment from 'moment-timezone';
import { Timezone } from 'timezones.json';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

enum Status {
	morning,
	noon,
	evening,
	night,
}

export interface HomeState {
	currentTimeZone: Timezone;
	status: Status;
	currentTime: Number;
}

const initialState: HomeState = {
	currentTime: 0,
	status: Status.morning,
	currentTimeZone: {
		value: 'India Standard Time',
		abbr: 'IST',
		offset: 5.5,
		isdst: false,
		text: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
		utc: ['Asia/Kolkata', 'Asia/Calcutta'],
	},
};

export const homeSlice = createSlice({
	name: 'home',
	initialState,
	reducers: {
		setTimezone: (state, action: PayloadAction<Timezone>) => {
			const hour = Number(
				moment().tz(action.payload.utc[0]).format('HH')
			);

			state.currentTimeZone = action.payload;
			state.currentTime = hour;

			if (hour < 12) {
				state.status = Status.morning;
			} else if (hour <= 17) {
				state.status = Status.noon;
			} else if (hour <= 21) {
				state.status = Status.evening;
			} else {
				state.status = Status.night;
			}
		},
	},
});

export const { setTimezone } = homeSlice.actions;

export default homeSlice.reducer;
