import { useTheme } from "@mui/material";

function Separator() {
  const theme = useTheme();

  return (
    <div className="Separator" style={{ background: theme.palette.divider }} />
  );
}

export default Separator;
