import React from 'react';
import aristotelian from './images/logoPlaceholder.png';
import confucian from './images/logoPlaceholder.png';
import deontological from './images/logoPlaceholder.png';
import egoist from './images/logoPlaceholder.png';
import epicurean from './images/logoPlaceholder.png';
import './Results.css'
import {Link} from 'react-router-dom';
import { db } from './firebase';

class Results extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      results: {
        'aristotelian': 0,
        'confucian': 0,
        'deontological': 0,
        'egoist': 0,
        'epicurean': 0,
        'feminist': 0,
        'legalist': 0,
        'stoic': 0,
        'utilitarian': 0
      },
      percentages: {
        'aristotelian': 0,
        'confucian': 0,
        'deontological': 0,
        'egoist': 0,
        'epicurean': 0,
        'feminist': 0,
        'legalist': 0,
        'stoic': 0,
        'utilitarian': 0
      },
      candidates: {
        'aristotelian': {
          'url': 'https://joebiden.com/joes-vision/',
          'img': aristotelian
        },
        'confucian': {
          'url': 'https://peteforamerica.com/issues/',
          'img': confucian
        },
        'deontological': {
          'url': 'https://sanderssanders.com/issues/',
          'img': deontological
        },
        'egoist': {
          'url': 'https://elizabethwarren.com/plans',
          'img': egoist
        },
        'epicurean': {
          'url': 'https://www.promiseskept.com/about/',
          'img': epicurean
        }
      },
      sortedPerentages: []
    };
    this.loadResults = this.loadResults.bind(this);
  }

  async componentDidMount() {
    await this.loadResults();
  }

  loadResults = async () => {
    let results = {};
    await db.collection("users").get().then((querySnapshot) => {
      // only one user for now
      querySnapshot.forEach((doc) => {
        results = doc.data()['totals'];
      });
    });
    var percentages = {}
    var total_points = parseInt(results.aristotelian) + parseInt(results.confucian) + parseInt(results.deontological) + parseInt(results.egoist) + parseInt(results.epicurean);
    var num_questions = total_points/20;
    var high_score = num_questions * 10;
    percentages['aristotelian'] = parseInt(results.aristotelian)/high_score * 100;
    percentages['confucian'] = parseInt(results.confucian)/high_score * 100;
    percentages['deontological'] = parseInt(results.deontological)/high_score * 100;
    percentages['egoist'] = parseInt(results.egoist)/high_score * 100;
    percentages['epicurean'] = parseInt(results.epicurean)/high_score * 100;

    let sortedPerentages = [];

    for (var key in percentages) {
        if (percentages.hasOwnProperty(key)) {
          sortedPerentages.push( [ key, percentages[key] ] );
        }
    }

    sortedPerentages.sort((a, b) => b[1] - a[1]);
    console.log(sortedPerentages);

    this.setState({ percentages, sortedPerentages });

    console.log(this.state.sortedPerentages);
  }

  render() {
    return (
      <div>
        <h1>Results</h1>
        {
          this.state.sortedPerentages.map((candidate, index) => {
            // return this.state.candidates[candidate[0]].img
            if (index == 0){
              return <p key={index} className="c1"><a href={this.state.candidates[candidate[0]].url}><img src={this.state.candidates[candidate[0]].img} alt="char" className='i1' /></a> {this.state.percentages[candidate[0]].toFixed(2)}% match</p>
            } else {
              return <p key={index} className="c2"><a href={this.state.candidates[candidate[0]].url}><img src={this.state.candidates[candidate[0]].img} alt="char" className='i2' /></a> {this.state.percentages[candidate[0]].toFixed(2)}% match</p>
            }
          })
        }
        <p className="c3">Click on a frameworks's picture to learn more about the framework.</p>
        <Link to='/DetailedResults'> 
            <div className="center_div"><button type="button" className="buttonResults"><b>Detailed Results</b></button></div>
        </Link>
        <Link to='/Home'> 
            <div className="center_div"><button type="button" className="buttonResults"><b>Restart</b></button></div>
        </Link>
        </div>

    )
  }
}

export default Results;