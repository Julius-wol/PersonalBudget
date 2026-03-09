import React, { createContext, useReducer } from 'react';

export const BudgetContext = createContext();

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    expenses: []
};

function budgetReducer(state, action) {
    switch (action.type) {
        case 'LOGIN': return { ...state, user: action.payload };
        case 'LOGOUT': return { ...state, user: null, expenses: [] };
        case 'SET_EXPENSES': return { ...state, expenses: action.payload };
        case 'ADD_EXPENSE': return { ...state, expenses: [...state.expenses, action.payload] };
        case 'DELETE_EXPENSE': return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
        case 'UPDATE_EXPENSE': return {
            ...state,
            expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e)
        };
        default: return state;
    }
}

export const BudgetProvider = ({ children }) => {
    const [state, dispatch] = useReducer(budgetReducer, initialState);
    return (
        <BudgetContext.Provider value={{ state, dispatch }}>
            {children}
        </BudgetContext.Provider>
    );
};