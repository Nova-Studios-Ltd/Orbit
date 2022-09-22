import React, {  } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconButton, useTheme } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon } from "@mui/icons-material";
import { SettingsManager } from "NSLib/SettingsManager";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChannelList from "Components/Channels/ChannelList/ChannelList";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericHeader from "Components/Headers/GenericHeader/GenericHeader";

import type { SharedProps, View } from "Types/UI/Components";
import { Routes } from "Types/UI/Routes";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { IChannelUpdateProps } from "Types/API/Interfaces/IChannelUpdateProps";
import type IUserData from "Types/API/Interfaces/IUserData";

interface MainViewProps extends View {
  channels?: IRawChannelProps[],
  avatarNonce?: string,
  selectedChannel?: IRawChannelProps,
  channelMenuVisible?: boolean,
  onNavigateToPage?: (path: Routes) => void,
  setChannelMenuVisibility?: React.Dispatch<React.SetStateAction<boolean>>,
  onChannelClearCache?: (channel: IRawChannelProps) => void,
  onChannelClick?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onChannelEdit?: (channel: IChannelUpdateProps) => void,
  onChannelMenuToggle?: () => void,
  onChannelMove?: (currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) => void,
  onChannelRemoveRecipient?: (channel: IRawChannelProps, recipient: IUserData) => void,
  onChannelResetIcon?: (channel: IRawChannelProps) => void
}

function MainView(props: MainViewProps) {
  const Localizations_MainView = useTranslation("MainView").t;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const settings = new SettingsManager();

  const SharedPropsContext = React.createContext({} as SharedProps);

  return (
    <SharedPropsContext.Consumer>
      {
        sharedProps => {
          const onMainViewContainerRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (props.setChannelMenuVisibility && sharedProps && sharedProps.widthConstrained) {
              props.setChannelMenuVisibility(false);
            }
          }

          return (
            <ViewContainer>
              <div className="MainViewContainer">
                <CSSTransition classNames="MainViewContainerLeft" in={props.channelMenuVisible} timeout={10}>
                  <div className="MainViewContainerLeft">
                    <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
                      <AvatarTextButton className="NavigationButtonContainerItem" selected={location.pathname === Routes.Settings} onLeftClick={() => navigate(Routes.Settings)} iconSrc={`${settings.User.avatarSrc}&nonce=${props.avatarNonce || ""}`}>{Localizations_MainView("Typography-SettingsHeader")}</AvatarTextButton>
                      <AvatarTextButton className="NavigationButtonContainerItem" iconObj={<GroupIcon />} selected={location.pathname === Routes.Friends} onLeftClick={() => props.onNavigateToPage ? props.onNavigateToPage(Routes.Friends) : null}>{Localizations_MainView("Typography-FriendsHeader")}</AvatarTextButton>
                    </div>
                    <div className="MainViewChannelListContainer">
                      <GenericHeader className="MainViewHeader" title={Localizations_MainView("Header_Title-ChannelList")} childrenRight={
                        <div>
                          <IconButton onClick={() => navigate(Routes.Friends)}><AddIcon /></IconButton>
                        </div>
                      } />
                      <ChannelList className="MainViewChannelList" channels={props.channels} onChannelClearCache={props.onChannelClearCache} onChannelClick={props.onChannelClick} onChannelEdit={props.onChannelEdit} onChannelDelete={props.onChannelDelete} onChannelMove={props.onChannelMove} onChannelRemoveRecipient={props.onChannelRemoveRecipient} onChannelResetIcon={props.onChannelResetIcon} selectedChannel={props.selectedChannel} />
                    </div>
                  </div>
                </CSSTransition>
                <div className="MainViewContainerRight" onClick={onMainViewContainerRightClick} style={{ opacity: sharedProps?.widthConstrained && props.channelMenuVisible ? 0.5 : 1 }}>
                  <GenericHeader className="MainViewHeader MainViewContainerItem" title={sharedProps.title} childrenLeft={sharedProps?.widthConstrained ? <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); if (props.onChannelMenuToggle) props.onChannelMenuToggle(); }}><MenuIcon /></IconButton> : null} />
                  {props.page}
                </div>
              </div>
            </ViewContainer>
          )
        }
      }
    </SharedPropsContext.Consumer>
  );
}

export default MainView;
