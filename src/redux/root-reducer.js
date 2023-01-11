import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import alertsReducer from '../redux/alerts/alertsSlice'
import driverLocationReducer from '../redux/driverLocation/driverLocationSlice'
import liveChatReducer from '../redux/liveChat/liveChatSlice'
import appointmentsReducer from '../redux/appointments/appointmentsSlice'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['alerts', 'driver', 'messages', 'liveChat', 'appointments']
};

const rootReducer = combineReducers({
    alerts: alertsReducer,
    driver: driverLocationReducer,
    liveChat: liveChatReducer,
    appointments: appointmentsReducer
});

export default persistReducer(persistConfig, rootReducer);