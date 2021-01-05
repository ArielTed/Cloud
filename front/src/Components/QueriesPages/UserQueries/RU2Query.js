import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { runRU2Query } from '../../../utils/QueriesAPI';

import './userQueries.css'

function RU2Query() {
  const [showResult, setShowResult] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [championName, setChampionName] = useState();
  const [role, setRole] = useState();
  const [rows, setRows] = useState([]);

  function createData(item, item_score) {
    return { item, item_score };
  }

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    setRows([]);
    
    try {
      const response = await runRU2Query(championName, role);
      const { status, data } = response;
      setIsLoading(false);
      data.matches.map((e, i) => {
        setRows(rows => [...rows, createData(e.item, e.item_score)])
      })             
    }
    catch (err) {
      setIsLoading(false); 
      console.log(err)
    }
  }

  const handleChampionChange = (event) => {
    setChampionName(event.target.value);
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  const onCardClick = () => {
    setShowInput(true);
    setShowResult(showResult => !showResult)
  }

  return(
  <div className="Query">
    <h4>RU2</h4>
    <Card className="Query_card" onClick={onCardClick} >
      <CardContent>
        <Typography variant="h6" component="h6">
          How to play against a given champion and its position? 
        </Typography>
      </CardContent>
    
    { showInput &&
      <form noValidate autoComplete="off" className="queryForm">
        <div>
          <TextField 
          label="Champion Name" 
          placeholder="Ziggs, Warwick, Shyvana, ... " 
          defaultValue="Ziggs"
          style={{marginRight: '2rem', marginLeft: '1rem', marginBottom: '1rem'}} 
          onChange={handleChampionChange} 
          />
          <TextField 
          label="Role" 
          placeholder="mid, bottom, top, ..." 
          defaultValue="mid"
          style={{marginRight: '2rem', marginBottom: '1rem'}} 
          onChange={handleRoleChange} 
          />
          <Button variant="contained" onClick={() => handleExecuteQuery(championName, role)}>Run query</Button>
        </div>
      </form>
    }

    { isLoading && showResult &&
      <CircularProgress />
    }
    
    { !isLoading && showResult && 
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className="tableCell_title">Item</TableCell>
              <TableCell align="center">Item Score</TableCell>  
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.item}>
                <TableCell align="center" className="result_tableCell" component="th" scope="row">
                  {row.item}
                </TableCell>
                <TableCell align="center">{row.item_score}</TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    }
    </Card>

  </div>
  )
}

export default RU2Query
