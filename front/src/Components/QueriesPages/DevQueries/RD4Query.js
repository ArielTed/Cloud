import React, { useEffect, useState } from 'react'
import { Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { runRD4Query } from '../../../utils/QueriesAPI';

import './devQueries.css'

function RD4Query() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  function createData(_id, duration, avg_kills, ratio_kill_per_second) {
    return { _id, duration, avg_kills, ratio_kill_per_second };
  }

  const handleCardClick = async () => {
    setIsLoading(true);
    setShowResult(showResult => !showResult);

    try {
      const response = await runRD4Query();
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        console.log(data.response[0])
        setRows(rows => [...rows, createData(data.response[0]._id, data.response[0].duration, data.response[0].avg_kills, data.response[0].ratio_kill_per_second)])
      }
    }
    catch (err) {
      setIsLoading(false); 
      console.log(err)
    }
  }

  return(
  <div className="Query">
    <h4>RD4</h4>
    <Card className="Query_card" onClick={() => handleCardClick()}>
      <CardContent>
        <Typography variant="h6" component="h6">
          Are there notable differences in lengths and total number of kills in games from different servers ?
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
              <TableCell align="center" className="tableCell_title">_id</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Avg kills</TableCell>
              <TableCell align="center">Kill per second ratio</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell align="center" className="result_tableCell" component="th" scope="row"> {row._id}</TableCell>
                <TableCell align="center">{row.duration.toFixed(4)}</TableCell>
                <TableCell align="center">{row.avg_kills.toFixed(4)}</TableCell>
                <TableCell align="center">{row.ratio_kill_per_second.toFixed(4)}</TableCell>
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

export default RD4Query
