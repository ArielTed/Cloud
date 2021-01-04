import React, { useEffect, useState } from 'react'
import { Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { runRU1Query } from '../../../utils/QueriesAPI';


function RU1Query() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  function createData(championName, value) {
    return { championName, value };
  }

  useEffect(() => {

  }, [rows])

  const handleCardClick = async () => {
    setIsLoading(true);
    setShowResult(showResult => !showResult);

    try {
      const response = await runRU1Query();
      const { status, data } = response;

      if (status === 200) {
        setIsLoading(false);
        data.map((e, i) => {
          setRows(rows => [...rows, createData(e.name, e.id)])
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
    <Card className="Query_card" onClick={() => handleCardClick()}>
      <CardContent>
        <Typography variant="h6" component="h6">
        Which champions played as “jungler” most often manage to secure the first dragon?
        </Typography>
      </CardContent>
    </Card>

    { isLoading && showResult &&
      <CircularProgress />
    }
    
    { !isLoading && showResult && 
      <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Champ Name</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.championName}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.carbs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    }
  </div>
  )
}

export default RU1Query
