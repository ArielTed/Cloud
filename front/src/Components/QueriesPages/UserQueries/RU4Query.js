import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { runRU4Query } from '../../../utils/QueriesAPI';

import './userQueries.css'

function RU4Query() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  function createData(champsArr, totaldmgobj) {
    return { champsArr, totaldmgobj };
  }

  const handleCardClick = async () => {
    setIsLoading(true);
    setShowResult(showResult => !showResult);

    try {
      const response = await runRU4Query();
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        let champsArray = [];
        data.teamSynergy.map((e, i) => {
          champsArray = e.champs;
          setRows(rows => [...rows, createData(champsArray, e.totaldmgobj)])
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
    <h4>RU4</h4>
    <Card className="Query_card" onClick={() => handleCardClick()}>
      <CardContent>
        <Typography variant="h6" component="h6">
         Is there a combination of support/carry type champions with a positive synergy allowing their 
         team to destroy a large number of towers (more than 10) ?        
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
              <TableCell align="center" className="tableCell_title">Champion 1</TableCell>
              <TableCell align="center">Champion 2</TableCell>
              <TableCell align="center">Champion 3</TableCell>
              <TableCell align="center">Champion 4</TableCell>
              <TableCell align="center">Champion 5</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              { rows.map((e, i) => 
                <TableRow key={e.totaldmgobj}>
                  {e.champsArr.map((e,i) => 
                    <TableCell key={i} align="center">{e}</TableCell>
                  )
                  }
                  {/* <TableCell align="center" className="result_tableCell" component="th" scope="row"> {row.champ0}</TableCell>
                  <TableCell align="center">{row.champ2}</TableCell>
                  <TableCell align="center">{row.champ3}</TableCell>
                  <TableCell align="center">{row.champ4}</TableCell> */}
                </TableRow>
              )
            } 
              
          </TableBody>
        </Table>
      </TableContainer>
    }
    </Card>

  </div>
  )
}

export default RU4Query
