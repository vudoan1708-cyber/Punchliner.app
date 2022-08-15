import { navigate } from 'svelte-navigator';

/**
 * Navigate to the Punchliner's homepage
 *
*/
export default (): void => {
  navigate('/', { replace: false });
};
