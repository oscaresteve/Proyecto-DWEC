import { BehaviorSubject } from "rxjs";

const initialState = {
  user: {
    email: null,
    token: null,
    nickname: null,
    max_score: 0,
  },
  route: "login",
  game: {},
};

const state$ = new BehaviorSubject(initialState);

function setState(partial) {
  state$.next({ ...state$.value, ...partial });
  console.log("Estado Actualizado: ", state$.value);
  
}

export { state$, setState };
