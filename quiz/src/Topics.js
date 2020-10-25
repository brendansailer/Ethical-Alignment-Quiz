import React from 'react';
import './topics.css';
import {Redirect, withRouter} from 'react-router-dom';
import gun from './images/gun.svg'
import econ from './images/economy.svg'
import edu from './images/education.svg'
import hc from './images/hc.svg'
import env from './images/env.svg'
import { db } from './firebase';
import {Link} from 'react-router-dom';

class Topics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      percentages: {},
      topics: {
        economy: 50,
        education: 50,
        environment: 50,
        guncontrol: 50,
        healthcare: 50
      },
      move: false,
    };
    this.addTopicPreferences = this.addTopicPreferences.bind(this);
  }

  handleChange = (event, val) => {
    let topics = this.state.topics;
    topics[val] = parseInt(event.target.value)-1;
    this.setState({ topics });
  }

  addTopicPreferences = async () => {
    const t = this;
    let doc_id;
    await db.collection("users").get().then((querySnapshot) => {
      // only one user for now
      querySnapshot.forEach((doc) => {
        doc_id = doc.id;
      });
    });
    await db.collection("users").doc(doc_id).update({
      categories: this.state.topics,
      totals: {
        'deontological': 0,
        'egoist': 0,
        'epicurean': 0,
        'feminist': 0,
        'legalist': 0,
        'utilitarian': 0
      },
      responses: {
        'economy': {
          'question1': {
            'answered': false
          },
          'question2': {
            'answered': false
          },
          'question3': {
            'answered': false
          },
        },
        'environment': {
          'question1': {
            'answered': false
          },
          'question2': {
            'answered': false
          },
          'question3': {
            'answered': false
          },
        },
        'guncontrol': {
          'question1': {
            'answered': false
          },
          'question2': {
            'answered': false
          },
          'question3': {
            'answered': false
          },
        },
        'healthcare': {
          'question1': {
            'answered': false
          },
          'question2': {
            'answered': false
          },
          'question3': {
            'answered': false
          },
        },
        'education': {
          'question1': {
            'answered': false
          },
          'question2': {
            'answered': false
          },
          'question3': {
            'answered': false
          },
        },
      }
    })
    .then(function() {
      console.log("Document successfully updated!");
      t.setState({ move: true });
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  render() {
    if (this.state.move){
      return <Redirect to='/quiz' />
    }
    return (
      <div>
        <h1>Topics</h1>

        <img src={econ} alt="gun" className='icon'/>
        <h2 className="topic_title">Economy</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange1" step="25" list="range-labels" value={this.state.topics.economy} onChange={(ev) => this.handleChange(ev, 'economy')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={edu} alt="gun" className='icon'/>
        <h2 className="topic_title">Education</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange2" step="25" list="range-labels" value={this.state.topics.education} onChange={(ev) => this.handleChange(ev, 'education')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={env} alt="gun" className='icon'/>
        <h2 className="topic_title">Environment</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange3" step="25" list="range-labels" value={this.state.topics.environment} onChange={(ev) => this.handleChange(ev, 'environment')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={gun} alt="gun" className='icon'/>
        <h2 className="topic_title">Gun Control</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange4" step="25" list="range-labels" value={this.state.topics.guncontrol} onChange={(ev) => this.handleChange(ev, 'guncontrol')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={hc} alt="gun" className='icon'/>
        <h2 className="topic_title">Health Care</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange5" step="25" list="range-labels" value={this.state.topics.healthcare} onChange={(ev) => this.handleChange(ev, 'healthcare')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>
        <Link to='/quiz'> 
          <div className="take_quiz"><button type="button" className="buttonTop" onClick={() => this.addTopicPreferences()}><b>Take Quiz</b></button></div>
        </Link>
      </div>
    )
  }
}

export default withRouter(Topics);