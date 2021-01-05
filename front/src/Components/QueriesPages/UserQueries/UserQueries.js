import { Container } from '@material-ui/core';
import RU1Query from '../UserQueries/RU1Query';
import RU2Query from '../UserQueries/RU2Query';
import RU3Query from '../UserQueries/RU3Query';
import RU4Query from '../UserQueries/RU4Query';
import './userQueries.css'

function UserQueries() {
  return (
    <Container>
      <h1 style={{textAlign: 'center'}}>User Queries</h1>
      <div className="UserQueries">
        <RU1Query />
        <RU2Query />
        <RU3Query />
        <RU4Query />
      </div>
    </Container>
  )
}

export default UserQueries
