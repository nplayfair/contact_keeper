import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case ADD_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.payload]
      }
    case UPDATE_CONTACT:
      return {
        ...state,
        // Match the contact in the state with the passed in contact id
        contacts: state.contacts.map(contact => contact.id === action.payload.id ? action.payload : contact)
      }
    case DELETE_CONTACT:
      return {
        ...state,
        // Return all contacts from state that are not the id sent in the payload
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      }
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      }
    default:
      return state;
  }
}