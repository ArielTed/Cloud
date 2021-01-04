import { Container } from '@material-ui/core';
import RU1Query from '../UserQueries/RU1Query';
import './userQueries.css'

function UserQueries() {
  return (
    <Container>
      <div className="UserQueries">
        <RU1Query />
        <h2>Query 2</h2>
        <h2>Query 3</h2>
      </div>
    </Container>
  )
}

export default UserQueries
