// Global
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconButton, CircularProgress, useTheme } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon } from "@mui/icons-material";

// Source
import { AutoLogin } from "Init/AuthHandler";
import UserData from "Lib/Storage/Objects/UserData";
import { isSubroute } from "Lib/Utility/Utility";

// Redux
import { ChannelsPopulate } from "Redux/Thunks/Channels";
import { FriendsPopulate } from "Redux/Thunks/Friends";

// Components
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChannelList from "Components/Channels/ChannelList/ChannelList";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericHeader from "Components/Headers/GenericHeader/GenericHeader";

import { useDispatch, useSelector } from "Redux/Hooks";
import { closeChannelMenu, openChannelMenu } from "Redux/Slices/AppSlice";
import { generateSessionString } from "Redux/Thunks/App";
import { navigate } from "Redux/Thunks/Routing";

import type { View } from "Types/UI/Components";
import { Routes, Params } from "Types/UI/Routing";

interface MainViewProps extends View {
  avatarNonce?: string,
  channelMenuVisible?: boolean,
  sessionRef?: React.MutableRefObject<string>,
}

function MainView(props: MainViewProps) {
  const Localizations_MainView = useTranslation("MainView").t;
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  const pathname = location.pathname; // Might cause desync issues between state pathname and actual pathname, but needed for the channel preload check to work
  const title = useSelector(state => state.routing.title);
  const isDoingSomething = useSelector(state => state.app.isDoingSomething);
  const channelMenuVisible = useSelector(state => state.app.channelMenuOpen);
  const widthConstrained = useSelector(state => state.app.widthConstrained);

  const onMainViewContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (widthConstrained) {
      dispatch(closeChannelMenu());
    }
  }

  const onChannelMenuOpenButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(openChannelMenu());
  }

  useEffect(() => {
    dispatch(generateSessionString());

    AutoLogin().then((result: boolean) => {
      if (result) {
        if ((pathname === Routes.Chat) || (pathname === Routes.Root)) {
          dispatch(navigate({ pathname: Routes.FriendsList }));
        }
      }
      else {
        dispatch(navigate({ pathname: Routes.Login }));
      }
    }).then(() => {
      dispatch(ChannelsPopulate(pathname === Routes.Chat || pathname === Routes.FriendsList));
      dispatch(FriendsPopulate());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ViewContainer>
      <div className="MainViewContainer">
        {
          channelMenuVisible ?
          <div className="MainViewContainerLeft">
            <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
              <AvatarTextButton className="NavigationButtonContainerItem" selected={isSubroute(pathname, Routes.Settings)} onLeftClick={() => dispatch(navigate({ pathname: Routes.Dashboard }))} iconSrc={`${UserData.AvatarSrc}&nonce=${props.avatarNonce || ""}`}>{Localizations_MainView("Typography-SettingsHeader")}</AvatarTextButton>
              <AvatarTextButton className="NavigationButtonContainerItem" iconObj={<GroupIcon />} selected={isSubroute(pathname, Routes.Friends)} onLeftClick={() => dispatch(navigate({ pathname: Routes.FriendsList }))}>{Localizations_MainView("Typography-FriendsHeader")}</AvatarTextButton>
            </div>
            <div className="MainViewChannelListContainer">
              <GenericHeader className="MainViewHeader" title={Localizations_MainView("Header_Title-ChannelList")} childrenRight={
                <div>
                  <IconButton onClick={() => dispatch(navigate({ pathname: Routes.FriendsList, params: [ { key: Params.CreateGroup, unsetOnNavigate: true} ] }))}><AddIcon /></IconButton>
                </div>
              } />
              <ChannelList className="MainViewChannelList" />
            </div>
          </div>
        : null}
        <div className="MainViewContainerRight" onClick={onMainViewContainerClick} style={{ opacity: widthConstrained && channelMenuVisible ? 0.5 : 1 }}>
          <GenericHeader className="MainViewHeader MainViewContainerItem" title={title}
            childrenLeft={
            <>
              {widthConstrained ? <IconButton onClick={onChannelMenuOpenButtonClick}><MenuIcon /></IconButton> : null}
              {isDoingSomething ? <CircularProgress variant="indeterminate" /> : null}
            </>
            }/>
          <Outlet />
        </div>
      </div>
    </ViewContainer>
  );
}

export default MainView;
