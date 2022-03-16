import { Button, TextField } from "@mui/material";

import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "Types/Components";
import type { ReactNode } from "react";

interface MainViewProps extends View {

}

function MainView({page} : MainViewProps) {
  return (
    <PageContainer>
      {page}
    </PageContainer>
  );
}

export default MainView;
