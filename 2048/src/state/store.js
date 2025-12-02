import { BehaviorSubject } from "rxjs";

const initialState = {
  user: null,
  board: null,
  score: 0,
  view: "login", // "login" | "register" | "game"
  loading: false,
  error: null,
};

export const store$ = new BehaviorSubject(initialState);

export const updateState = (partialState) => {
  store$.next({
    ...store$.value,
    ...partialState,
  });
};

export const setUser = (user) => updateState({ user });
export const setBoard = (board) => updateState({ board });
export const setScore = (score) => updateState({ score });
export const setLoading = (loading) => updateState({ loading });
export const setError = (error) => updateState({ error });
export const setView = (view) => updateState({ view });
