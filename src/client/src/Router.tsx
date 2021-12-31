import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import Test from "./routes/Test";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/test">
          <Test />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
