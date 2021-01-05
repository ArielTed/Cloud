import React from 'react';  
import { Container } from '@material-ui/core';
import RD1Query from './RD1Query';
import RD2Query from './RD2Query';
import RD3Query from './RD3Query';
import RD4Query from './RD4Query';



import './devQueries.css'

function DevQueries() {
  return (
    <Container>
      <h1 style={{textAlign: 'center'}}>Data Analyst Queries</h1>
      <div className="UserQueries">
        <RD1Query />
        <RD2Query />
        <RD3Query />
        <RD4Query />
      </div>
    </Container>
  )
}

export default DevQueries
