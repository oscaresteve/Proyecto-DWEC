import { BehaviorSubject } from 'rxjs';

const initialState = {
  user: null,
  route: 'login',
  game: null
};

const state$ = new BehaviorSubject(initialState);

function setState(partial) {
  state$.next({ ...state$.value, ...partial });
}

export { state$, setState };
