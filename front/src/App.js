import { Route, Switch } from "react-router-dom";
import HeaderNav from './Components/HeaderNav/HeaderNav';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import UserQueries from './Components/QueriesPages/UserQueries/UserQueries';
import DevQueries from './Components/QueriesPages/DevQueries/DevQueries';



import './App.css';

const App = () => {
  return (
    <div className="app">
      <HeaderNav />
      <Switch>
        <Route exact path="/" component={ WelcomePage } />
        <Route exact path="/user-queries" component={ UserQueries } />
        <Route exact path="/dev-queries" component={ DevQueries } />
      </Switch>
    </div>
  );
}

export default App;
