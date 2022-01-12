import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Manual from "./routes/Manual";
import Test from "./routes/Test";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/manual">
          <Manual />
        </Route>
        <Route exact={true} path="/">
          <Redirect to="/manual" />
        </Route>
        <Route exact={true} path="/manual/:algorithm">
          <Manual />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
