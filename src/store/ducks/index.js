import { combineReducers } from 'redux';

const lightBoxReducer = ( state = { isOn: false }, action ) => {
  switch( action.type ) {
    case 'LIGHT_BOX_ON':
      return {
        isOn: true,
        data: action.data,
      };
    case 'LIGHT_BOX_OFF':
      return {
        isOn: false
      };
    default: return state;
  }
}

const reducers = combineReducers({
  default: () => [],
  lightBox: lightBoxReducer,
});

export default reducers;