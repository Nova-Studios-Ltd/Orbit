import { Button, TextField } from "@mui/material";

import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "Types/Components";
import type { ReactNode } from "react";

interface AuthViewProps extends View {

}

function AuthView({page} : AuthViewProps) {
  return (
    <PageContainer>
      {page}
    </PageContainer>
  );
}

export default AuthView;
