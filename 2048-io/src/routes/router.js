import { setState } from '../services/stateService.js';

export const router = {
  init() {
    window.addEventListener('hashchange', () => {
      const route = location.hash.replace('#', '') || 'login';
      setState({ route });
    });

    // inicial
    const route = location.hash.replace('#', '') || 'login';
    setState({ route });
  }
};
