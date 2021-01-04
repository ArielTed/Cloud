import React from 'react'
import QueriesSelector from '../QueriesSelector';
import './devQueries.css'

function DevQueries() {
  return (
    <div className="DevQueries">
      <div className="QueriesSelector_div">
        <QueriesSelector />
      </div>

      <div className="Queries_resultsDiv">
        User
      </div>
    </div>
  )
}

export default DevQueries
