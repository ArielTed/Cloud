import React from 'react'
import QueriesSelector from './QueriesSelector';
import './userQueries.css'
function UserQueries() {
  return (
    <div className="UserQueries">
      <div className="QueriesSelector_div">
        <QueriesSelector />
      </div>
      <div className="UserQueries_resultsDiv">
        User
      </div>
    </div>
  )
}

export default UserQueries
