import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import * as serviceWorker from './serviceWorker';

import Login from './login';
import Home from './home';

const history = createBrowserHistory();

const Main = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <Router history={history}>
    <Main history={history} />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
