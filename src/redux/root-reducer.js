import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import alertsReducer from '../redux/alerts/alertsSlice'
import driverLocationReducer from '../redux/driverLocation/driverLocationSlice'
import liveChatReducer from '../redux/liveChat/liveChatSlice'
import appointmentsReducer from '../redux/appointments/appointmentsSlice'
import userReducer from '../redux/user/userSlice'
import jumpsReducer from '../redux/admin/jumpsSlice'

const persistConfig = {
    key: 'bjc',
    storage,
    whitelist: ['alerts', 'driver', 'messages', 'liveChat', 'appointments', 'user', 'jump']
};

const rootReducer = combineReducers({
    alerts: alertsReducer,
    driver: driverLocationReducer,
    liveChat: liveChatReducer,
    appointments: appointmentsReducer,
    user: userReducer,
    jump: jumpsReducer
});

export default persistReducer(persistConfig, rootReducer);