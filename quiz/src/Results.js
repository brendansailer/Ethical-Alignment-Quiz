import React from 'react';
import './Results.css'
import {Link} from 'react-router-dom';
import { db } from './firebase';

class Results extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      results: {
        'deontological': 0,
        'egoist': 0,
        'epicurean': 0,
        'feminist': 0,
        'legalist': 0,
        'utilitarian': 0
      },
      percentages: {
        'deontological': 0,
        'egoist': 0,
        'epicurean': 0,
        'feminist': 0,
        'legalist': 0,
        'utilitarian': 0
      },
      candidates: {
        'deontological': {
          'url': 'https://en.wikipedia.org/wiki/Deontological_ethics',
          'img': "Deontological Ethics"
        },
        'egoist': {
          'url': 'https://en.wikipedia.org/wiki/Egoism',
          'img': "Egoism"
        },
        'epicurean': {
          'url': 'https://en.wikipedia.org/wiki/Epicureanism',
          'img': "Epicureanism"
        },
        'feminist': {
          'url': 'https://en.wikipedia.org/wiki/Feminist_ethics',
          'img': "Feminist Ethics"
        },
        'legalist': {
          'url': 'https://en.wikipedia.org/wiki/Legalism_(Chinese_philosophy)',
          'img': "Legalist Ethics"
        },
        'utilitarian': {
          'url': 'https://en.wikipedia.org/wiki/Utilitarianism',
          'img': "Utilitarianism"
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
    var total_points = parseInt(results.deontological) + parseInt(results.egoist) + parseInt(results.epicurean) + parseInt(results.feminist) + parseInt(results.legalist) + parseInt(results.utilitarian);
    var num_questions = total_points/26;
    var high_score = num_questions * 10;
    percentages['deontological'] = parseInt(results.deontological)/high_score * 100;
    percentages['egoist'] = parseInt(results.egoist)/high_score * 100;
    percentages['epicurean'] = parseInt(results.epicurean)/high_score * 100;
    percentages['feminist'] = parseInt(results.feminist)/high_score * 100;
    percentages['legalist'] = parseInt(results.legalist)/high_score * 100;
    percentages['utilitarian'] = parseInt(results.utilitarian)/high_score * 100;

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
        <p className="c3">Click on a frameworks's name to learn more about it.</p>
        {
          this.state.sortedPerentages.map((candidate, index) => {
            // return this.state.candidates[candidate[0]].img
            if (index === 0){
              return <p key={index} className="c1"><a href={this.state.candidates[candidate[0]].url}> {this.state.candidates[candidate[0]].img} </a> {this.state.percentages[candidate[0]].toFixed(2)}% match</p>
            } else {
              return <p key={index} className="c2"><a href={this.state.candidates[candidate[0]].url}> {this.state.candidates[candidate[0]].img} </a> {this.state.percentages[candidate[0]].toFixed(2)}% match</p>
            }
          })
        }
        <a href="https://forms.gle/zZKQNzwhDMzVgQSX6" className="c3">Please fill out our post-reflection survey here.</a>
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