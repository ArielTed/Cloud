import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { runRD2Query } from '../../../utils/QueriesAPI';

import './devQueries.css'

function RD2Query() {
  const [showResult, setShowResult] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [championName, setChampionName] = useState();
  const [answerType, setAnswerType] = useState();
  const [rows, setRows] = useState([]);

  function createData(version, nbBans) {
    return { version, nbBans };
  }

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    
    try {
      const response = await runRD2Query(championName, answerType);
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        data.banRate.map((e, i) => {
          setRows(rows => [...rows, createData(e.version, e.total)])
        })
      }
    }
    catch (err) {
      setIsLoading(false); 
      console.log(err)
    }
  }

  const handleChampionChange = (event) => {
    setChampionName(event.target.value);
  };
  const handleAnswerChange = (event) => {
    setAnswerType(event.target.value);
  };
  const onCardClick = () => {
    setShowInput(true);
    setShowResult(showResult => !showResult)
  }

  return(
  <div className="Query">
    <h4>RD2</h4>
    <Card className="Query_card" onClick={onCardClick} >
      <CardContent>
        <Typography variant="h6" component="h6">
          Has the diversification of champions played and banned improved over the course of seasons (game versions).
        </Typography>
      </CardContent>
    
    { showInput &&
      <form noValidate autoComplete="off">
        <div>
          <TextField 
          label="Champion Name" 
          placeholder="Ziggs, Warwick, Shyvana, ... " 
          style={{marginRight: '2rem', marginLeft: '1rem', marginBottom: '1rem'}} 
          onChange={handleChampionChange} 
          />
          <TextField 
          label="Answer type" 
          placeholder="playingRate, banRate, ..." 
          style={{marginRight: '2rem', marginBottom: '1rem'}} 
          onChange={handleAnswerChange} 
          />
          <Button variant="contained" onClick={() => handleExecuteQuery(championName, answerType)}>Run query</Button>
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
              <TableCell align="center" className="tableCell_title">Version</TableCell>
              <TableCell align="center">Nb of Bans</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.version}>
                <TableCell align="center" className="result_tableCell" component="th" scope="row">
                  {row.version}
                </TableCell>
                <TableCell align="center">{row.nbBans}</TableCell>
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

export default RD2Query
