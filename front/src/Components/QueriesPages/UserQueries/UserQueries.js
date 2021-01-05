import { Container } from '@material-ui/core';
import RU1Query from '../UserQueries/RU1Query';
import './userQueries.css'

function UserQueries() {
  return (
    <Container>
      <h1 style={{textAlign: 'center'}}>User Queries</h1>
      <div className="UserQueries">
        <RU1Query />
      </div>
    </Container>
  )
}

export default UserQueries
