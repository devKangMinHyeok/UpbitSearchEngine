import { useEffect } from "react";
import { Link, Route, Switch, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { autoNavState } from "../../atoms";
import BackTest from "./backtest/BackTest";
import DashBoard from "./dashboard/Dashboard";
import SettingBoard from "./settingBoard/SettingBoard";

const Container = styled.div`
  width: 100%;
  margin: 10px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  background-color: gray;
  padding: 10px;
  border-radius: 10%;
  color: ${(props) => (props.isActive ? "orange" : "white")};
  &:hover {
    cursor: pointer;
  }
`;

const DASHBOARD = "dashboard";
const SETTING_BOARD = "setting";
const BACK_TEST = "backtest";

function NavContainer() {
  const navState = useRecoilValue(autoNavState);
  return (
    <>
      <Nav>
        <Tab isActive={navState === DASHBOARD ? true : false}>
          <Link to={`/auto/dashboard`}>dashboard</Link>
        </Tab>
        <Tab isActive={navState === SETTING_BOARD ? true : false}>
          <Link to={`/auto/setting`}>setting</Link>
        </Tab>
        <Tab isActive={navState === BACK_TEST ? true : false}>
          <Link to={`/auto/backtest`}>backtest</Link>
        </Tab>
      </Nav>
    </>
  );
}

interface RouteParams {
  nav: string;
}

function ContentsSelector() {
  const [navState, setNavState] = useRecoilState(autoNavState);
  const { nav } = useParams<RouteParams>();
  useEffect(() => {
    setNavState(nav);
  }, [nav]);

  switch (nav) {
    case DASHBOARD:
      return <DashBoard />;
    case SETTING_BOARD:
      return <SettingBoard />;
    case BACK_TEST:
      return <BackTest />;

    default:
      return <DashBoard />;
  }
}

function ShowContainer() {
  return (
    <>
      <Switch>
        <Route path={`/auto/:nav`}>
          <ContentsSelector />
        </Route>
      </Switch>
    </>
  );
}

function AutoEngineContainer() {
  return (
    <Container>
      <NavContainer />
      <ShowContainer />
    </Container>
  );
}

export default AutoEngineContainer;
