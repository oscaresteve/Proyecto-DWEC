import { state$, setState } from '../services/stateService.js';

export const router = {
  init() {
    window.addEventListener('hashchange', () => {
      const route = location.hash.replace('#', '') || 'login';

      const user = state$.value.user;

      const protectedRoutes = ['home', 'game'];

      if (protectedRoutes.includes(route) && !user) {
        route = 'login';
        location.hash = '#login';
      }

      setState({ route });
    });

    const route = location.hash.replace('#', '') || 'login';
    setState({ route });
  }
};
