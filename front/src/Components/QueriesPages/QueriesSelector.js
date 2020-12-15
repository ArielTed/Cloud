import React from 'react'
import { Button, FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import './queriesSelector.css'

function QueriesSelector() {
  return (
    <div className="QueriesSelector">
      <div className="QueriesSelector_headerAndDropdown">
        <h3>Select a query : </h3>
        <QuerySelectComponent />
      </div>
      <Button variant="contained" color="primary">
        Run Query
      </Button>
    </div>
  )
}

const QuerySelectComponent = () => {
  const handleChange = () => {
    console.log("ok")
  }
  return (
    <FormControl>
      <InputLabel htmlFor="query-id">Query</InputLabel>
      <NativeSelect
        value="Queries"
        onChange={handleChange}
        inputProps={{
          name: 'query',
          id: 'query-id',
        }}
      >
        <option aria-label="None" value="" />
        <option value={10}>Ten</option>
        <option value={20}>Twenty</option>
        <option value={30}>Thirty</option>
      </NativeSelect>
    </FormControl>
  )
}

export default QueriesSelector
