import React from 'react'
import {Button} from '@material-ui/core';
import { useHistory , Link } from 'react-router-dom';
import './welcomePage.css'

function WelcomePage() {
  const history = useHistory();
  return (
    <div className="WelcomePage">
      <div className="WelcomePage_centerContainer container">
        <h2>Which queries do you want to see ?</h2>
        <div className="WelcomePage_userSelectorButtons_div">
        
          <Button variant="outlined" color="primary" onClick={() => history.push("/user-queries") } >
              User Queries
          </Button>
          <br/>
          <Button variant="outlined" color="primary" onClick={() => history.push("dev-queries") }>
              Developper Queries
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
