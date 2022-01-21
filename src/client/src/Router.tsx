import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Auto from "./routes/Auto";
import Manual from "./routes/Manual";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/manual">
          <Manual />
        </Route>
        <Route path="/auto">
          <Auto />
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
