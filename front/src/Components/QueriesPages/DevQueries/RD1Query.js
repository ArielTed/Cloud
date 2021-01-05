import React, { useEffect, useState } from 'react'
import { Card, CardContent, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { runRD1Query } from '../../../utils/QueriesAPI';

import './devQueries.css'

function RD1Query() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popularityRows, setPopularityRows] = useState([]);
  const [winRateRows, setWinRateRows] = useState([]);


  function createData(championName, value) {
    return { championName, value };
  }

  const handleCardClick = async () => {
    setIsLoading(true);
    setShowResult(showResult => !showResult);

    try {
      const response = await runRD1Query();
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        data.popularity.map((e, i) => {
          setPopularityRows(popularityRows => [...popularityRows, createData(e._id, e.popularity.toFixed(3))]);
        })
        data.winRate.map((e, i) => {
          setWinRateRows(winRateRows => [...winRateRows, createData(e._id, e.win_rate.toFixed(3))]);
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
    <h4>RD1</h4>
    <Card className="Query_card" onClick={() => handleCardClick()}>
      <CardContent>
        <Typography variant="h6" component="h6">
        By studying a champion’s popularity(1), ban percentage(2) and win ratio(3), which champions seem to be feared / loved ?
        </Typography>
      </CardContent>

    { isLoading && showResult &&
      <CircularProgress />
    }
    
    { !isLoading && showResult && 
    <Container>
        <h3>Popularity</h3>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className="tableCell_title">Champion Name</TableCell>
                <TableCell align="center">Popularity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {popularityRows.slice(0, 5).map((row) => (
                <TableRow key={row.championName}>
                  <TableCell align="center" className="result_tableCell" component="th" scope="row"> {row.championName}</TableCell>
                  <TableCell align="center">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Win Rate</h3>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className="tableCell_title">Champion Name</TableCell>
                <TableCell align="center">Win Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {winRateRows.slice(0, 5).map((row) => (
                <TableRow key={row.championName}>
                  <TableCell align="center" className="result_tableCell" component="th" scope="row"> {row.championName}</TableCell>
                  <TableCell align="center">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    }
    </Card>

  </div>
  )
}

export default RD1Query
