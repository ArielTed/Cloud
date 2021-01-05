import React, { useEffect, useState } from 'react'
import { Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { runRU2Query } from '../../../utils/QueriesAPI';

import './userQueries.css'

function RU2Query() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  function createData(championName, value) {
    return { championName, value };
  }

  const handleCardClick = async () => {
    setIsLoading(true);
    setShowResult(showResult => !showResult);

    try {
      const response = await runRU2Query();
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        data.response.map((e, i) => {
          setRows(rows => [...rows, createData(e._id, e.value)])
        })
      }
    }
    catch (err) {
      setIsLoading(false); 
      console.log(err)
    }
  }

  return(
  <div className="Query">
    <h4>RU2</h4>
    <Card className="Query_card" onClick={() => handleCardClick()}>
      <CardContent>
        <Typography variant="h6" component="h6">
        How to play against a given champion and its position? 
        </Typography>
      </CardContent>

    { isLoading && showResult &&
      <CircularProgress />
    }
    
    { !isLoading && showResult && 
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className="tableCell_title">Champion Name</TableCell>
              <TableCell align="center">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(0, 5).map((row) => (
              <TableRow key={row.championName}>
                <TableCell align="center" className="result_tableCell" component="th" scope="row"> {row.championName}</TableCell>
                <TableCell align="center">{row.value}</TableCell>
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

export default RU1Query
