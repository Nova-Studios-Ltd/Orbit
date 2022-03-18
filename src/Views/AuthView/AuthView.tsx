import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "Types/Components";

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
