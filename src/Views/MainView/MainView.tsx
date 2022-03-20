import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "DataTypes/Components";

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
