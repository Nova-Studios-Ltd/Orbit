import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "DataTypes/Components";

interface ViewProps extends View {

}

function View({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: ViewProps) {
  return (
    <ViewContainer noPadding>
      <div className="ViewContainer">

      </div>
    </ViewContainer>
  );
}

export default View;
