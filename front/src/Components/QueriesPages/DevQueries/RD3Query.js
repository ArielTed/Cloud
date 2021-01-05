import React, { useEffect, useState } from 'react'
import { Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { runRD3Query } from '../../../utils/QueriesAPI';

import './devQueries.css'

function RD3Query() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  function createData(avg_win_firstBlood, avg_win_firstTower, avg_win_firstDragon, avg_win_firstAll) {
    return { avg_win_firstBlood, avg_win_firstTower, avg_win_firstDragon, avg_win_firstAll };
  }

  const handleCardClick = async () => {
    setIsLoading(true);
    setShowResult(showResult => !showResult);

    try {
      const response = await runRD3Query();
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        setRows(rows => [...rows, createData(data.response[0].avg_win_firstBlood, data.response[0].avg_win_firstTower, data.response[0].avg_win_firstDragon, data.response[0].avg_win_firstAll)])
      }
    }
    catch (err) {
      setIsLoading(false); 
      console.log(err)
    }
  }

  return(
  <div className="Query">
    <h4>RD3</h4>
    <Card className="Query_card" onClick={() => handleCardClick()}>
      <CardContent>
        <Typography variant="h6" component="h6">
        What sort of correlations exist between the victory of a team and their success in being able to accomplish “first” objectives (first inhib, first baron, first tower…) ?
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
              <TableCell align="center" className="tableCell_title">Avg win first blood</TableCell>
              <TableCell align="center">Avg win first tower</TableCell>
              <TableCell align="center">Avg win first dragon</TableCell>
              <TableCell align="center">Avg win first all</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.avg_win_firstAll}>
                <TableCell align="center" className="result_tableCell" component="th" scope="row"> {row.avg_win_firstBlood.toFixed(3)}</TableCell>
                <TableCell align="center">{row.avg_win_firstTower.toFixed(3)}</TableCell>
                <TableCell align="center">{row.avg_win_firstDragon.toFixed(3)}</TableCell>
                <TableCell align="center">{row.avg_win_firstAll.toFixed(3)}</TableCell>
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

export default RD3Query
