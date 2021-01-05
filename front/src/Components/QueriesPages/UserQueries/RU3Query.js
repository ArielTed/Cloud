import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { runRU3Query } from '../../../utils/QueriesAPI';

import './userQueries.css'

function RU3Query() {
  const [showResult, setShowResult] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [championName, setChampionName] = useState();
  const [resultType, setResultType] = useState();
  const [rows, setRows] = useState([]);

  function createItemData(championName, item, effective) {
    return { championName, item, effective };
  }
  function createTrinketData(championName, trinket, effective) {
    return { championName, trinket, effective };
  } 
  function createSSData(championName, ss1, ss2, effective) {
    return { championName, ss1, ss2, effective };
  } 

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    setRows([]);
    
    try {
      const response = await runRU3Query(resultType);
      const { status, data } = response;
      setIsLoading(false);
      switch (resultType) {
        case 'item' :
          data.bestItems.map((e, i) => {
            setRows(rows => [...rows, createItemData(e.Champ, e.item, e.effective)])
          })
        
        case 'trinket' :
          data.bestTrinket.map((e, i) => {
            setRows(rows => [...rows, createTrinketData(e.Champ, e.trinket, e.effective)])
          }) 
        
        case 'ss' :
          data.bestSS.map((e, i) => {
            setRows(rows => [...rows, createSSData(e.Champ, e.ss1, e.ss2, e.effective)])
          }) 
  

      }
                
    }
    catch (err) {
      setIsLoading(false); 
      console.log(err)
    }
  }
  
  const handleResultTypeChange = (event) => {
    setResultType(event.target.value);
  };
  const onCardClick = () => {
    setShowInput(true);
    setShowResult(showResult => !showResult)
  }

  return(
  <div className="Query">
    <h4>RU3</h4>
    <Card className="Query_card" onClick={onCardClick} >
      <CardContent>
        <Typography variant="h6" component="h6">
          Which trinket, and summoner spells should you choose when playing with Ziggs in order to have a better chance of winning ? 
        </Typography>
      </CardContent>
    
    { showInput &&
      <form noValidate autoComplete="off" className="queryForm">
        <div>
          <TextField 
          label="Type" 
          placeholder="ss, item, trinket" 
          style={{marginRight: '2rem', marginLeft: '1rem', marginBottom: '1rem'}} 
          onChange={handleResultTypeChange} 
          />
          <Button variant="contained" onClick={() => handleExecuteQuery()}>Run query</Button>
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
              <TableCell align="center" className="tableCell_title">Champion Name</TableCell>
              { resultType === "item" &&
                <TableCell align="center">Item</TableCell>                
              }
              { resultType === "trinket" &&
                <TableCell align="center">Trinket</TableCell>                
              }
              { resultType === "ss" &&
                <>
                  <TableCell align="center">Summonner Spell 1</TableCell>  
                  <TableCell align="center">Summonner Spell 2</TableCell>
                </>
              }
              <TableCell align="center">Effective</TableCell>  
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.item}>
                <TableCell align="center" className="result_tableCell" component="th" scope="row">
                  {row.championName}
                </TableCell>
                { resultType === "item" &&
                  <TableCell align="center">{row.item}</TableCell>    
                }
                { resultType === "trinket" &&
                  <TableCell align="center">{row.trinket}</TableCell>    
                }
                { resultType === "ss" &&
                  <>
                    <TableCell align="center">{row.ss1}</TableCell>   
                    <TableCell align="center">{row.ss2}</TableCell>   
                  </> 
                }
                <TableCell align="center">{row.effective}</TableCell>                
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

export default RU3Query
