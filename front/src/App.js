import { Route, Switch } from "react-router-dom";
import HeaderNav from './Components/HeaderNav/HeaderNav';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import UserQueries from './Components/QueriesPages/UserQueries';
import DevQueries from './Components/QueriesPages/DevQueries';



import './App.css';

const App = () => {
  return (
    <div className="app">
      <HeaderNav />
      <Switch>
        <Route exact path="/" component={ WelcomePage } />
        <Route exact path="/user-queries" component={ UserQueries } />
        <Route exact path="/dev-queries" component={ DevQueries } />
        {/*<Route exact path="/admin-panel" component={ UserQueries } />  */}
      </Switch>
    </div>
  );
}

export default App;
