import { Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import FriendView from "Views/FriendView/FriendView";

import type { Page } from "DataTypes/Components";
import { FriendViewRoutes } from "DataTypes/Routes";

interface FriendPageProps extends Page {
  onChannelCreate?: (recipient: string) => void,
}

function FriendPage(props: FriendPageProps) {
  const Localizations_FriendPage = useTranslation("FriendPage").t;
  const classNames = useClassNames("FriendPageContainer", props.className);

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_FriendPage("PageTitle"));
  }, [Localizations_FriendPage, props, props.sharedProps?.changeTitleCallback]);

  return (
    <PageContainer className={classNames} adaptive={false}>
      <AvatarTextButton showEllipsis>Fake Friend 1</AvatarTextButton>
      <AvatarTextButton showEllipsis>Fake Friend 2</AvatarTextButton>
      <AvatarTextButton showEllipsis>Fake Friend 3</AvatarTextButton>
      <AvatarTextButton showEllipsis>Fake Friend 4</AvatarTextButton>
      <AvatarTextButton showEllipsis>Fake Friend 5</AvatarTextButton>
    </PageContainer>
  );
}

export default FriendPage;
