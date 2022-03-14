import { Button, TextField } from "@mui/material";

import Page from "Components/Page/Page";

function LoginPage() {
  return (
    <Page>
      <div className="LoginFormContainer">
        <form className="LoginForm">
          <TextField />
          <TextField />
          <Button>Login</Button>
        </form>
      </div>

    </Page>
  );
}

export default LoginPage;
