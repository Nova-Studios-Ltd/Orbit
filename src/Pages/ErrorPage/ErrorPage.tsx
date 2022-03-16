import { Button, TextField, Typography } from "@mui/material";

import PageContainer from "Components/PageContainer/PageContainer";

import type { Page } from "Types/Components";

interface ErrorPageProps extends Page {
  errorCode: number
}

function ErrorPage({ errorCode }: ErrorPageProps) {
  return (
    <PageContainer>
      <Typography variant="caption">Error {errorCode}</Typography>
    </PageContainer>
  );
}

export default ErrorPage;
