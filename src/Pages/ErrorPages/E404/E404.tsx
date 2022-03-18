import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function E404() {
  const Localizations_Common = useTranslation().t;
  const Localizations_E404 = useTranslation("E404").t;

  return (
    <div>
      <Typography variant="h4">{Localizations_E404("Typography-ErrorCaption")}</Typography>
      <br />
      <Typography variant="body1">{Localizations_E404("Typography-ErrorDetails")}</Typography>
    </div>
  );
}

export default E404;
