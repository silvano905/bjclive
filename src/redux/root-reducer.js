import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import alertsReducer from '../redux/alerts/alertsSlice'
import driverLocationReducer from '../redux/driverLocation/driverLocationSlice'
import liveChatReducer from '../redux/liveChat/liveChatSlice'
import appointmentsReducer from '../redux/appointments/appointmentsSlice'
import userReducer from '../redux/user/userSlice'

const persistConfig = {
    key: 'bjc',
    storage,
    whitelist: ['alerts', 'driver', 'messages', 'liveChat', 'appointments', 'user']
};

const rootReducer = combineReducers({
    alerts: alertsReducer,
    driver: driverLocationReducer,
    liveChat: liveChatReducer,
    appointments: appointmentsReducer,
    user: userReducer
});

export default persistReducer(persistConfig, rootReducer);