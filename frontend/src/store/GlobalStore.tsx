import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type GlobalState = {
  language: string;
};

type Action =
  | { type: 'SET_LANGUAGE'; payload: string };

const initialState: GlobalState = {
  language: 'English',
};

function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}

const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalStore = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalStore must be used within a GlobalProvider');
  }
  return context;
};
