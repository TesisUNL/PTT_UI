//

import Card from './Card';
import Paper from './Paper';
import Input from './Input';
import Button from './Button';
import Tooltip from './Tooltip';
import Backdrop from './Backdrop';
import Typography from './Typography';
import CssBaseline from './CssBaseline';
import Autocomplete from './Autocomplete';
import DataGrid from './DataGrid';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Card(theme),
    Input(theme),
    Paper(theme),
    Button(theme),
    Tooltip(theme),
    Backdrop(theme),
    Typography(theme),
    DataGrid(theme),
    CssBaseline(theme),
    Autocomplete(theme)
  );
}
