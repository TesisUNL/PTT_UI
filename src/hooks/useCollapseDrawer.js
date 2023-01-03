import { useContext } from 'react';
import { CollapseDrawerContext } from '../context/CollapseDrawerContext';

// ----------------------------------------------------------------------

export const useCollapseDrawer = () => useContext(CollapseDrawerContext);

export default useCollapseDrawer;
