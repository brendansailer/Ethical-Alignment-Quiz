import React from 'react';
import logo from './images/logo.svg'
import './home.css'
import {Link} from 'react-router-dom';

class Home extends React.Component {
  render() {
    return (
      <div>
        <img src={logo} alt="logo"/>
        <p className="p1b">How can we avoid our biases and recongize what ethical framework we align most with? </p>
        <hr></hr>
        <p className="p2">Welcome to the Ethical Alignment Quiz, a web app that helps you understand what framework you align with.</p>
        <Link to='/topics'> 
          <div className="center_div_home"><button type="button" className="buttonMain"><b>Start Quiz</b></button></div>
        </Link>
      </div>
    )
  }
}

export default Home;