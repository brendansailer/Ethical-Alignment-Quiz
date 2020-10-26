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
        automation: 50,
        weapons: 50,
        surveillance: 50,
        corporate: 50,
        mission: 50
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
        'automation': {
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
        'weapons': {
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
        'surveillance': {
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
        'corporate': {
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
        'mission': {
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
        <h2 className="topic_title">Job Automation</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange1" step="25" list="range-labels" value={this.state.topics.automation} onChange={(ev) => this.handleChange(ev, 'automation')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={edu} alt="gun" className='icon'/>
        <h2 className="topic_title">Autonomous Weapons</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange2" step="25" list="range-labels" value={this.state.topics.weapons} onChange={(ev) => this.handleChange(ev, 'weapons')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={env} alt="gun" className='icon'/>
        <h2 className="topic_title">Government Surveillance</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange3" step="25" list="range-labels" value={this.state.topics.surveillance} onChange={(ev) => this.handleChange(ev, 'surveillance')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={gun} alt="gun" className='icon'/>
        <h2 className="topic_title">Corporate Responsibility</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange4" step="25" list="range-labels" value={this.state.topics.corporate} onChange={(ev) => this.handleChange(ev, 'corporate')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>

        <img src={hc} alt="gun" className='icon'/>
        <h2 className="topic_title">Mission Critical Systems</h2>
        <div className="slidecontainer">
        <input type="range" min="1" max="101" className="slider" id="myRange5" step="25" list="range-labels" value={this.state.topics.mission} onChange={(ev) => this.handleChange(ev, 'mission')}/>
        <div className="label_div not">Not at all important</div>
        <div className="label_div low">Low importance</div>
        <div className="label_div neutral">Neutral</div>
        <div className="label_div important">Important</div>
        <div className="label_div very">Very important</div> 
        </div>
        <div className="take_quiz"><button type="button" className="buttonTop" onClick={() => this.addTopicPreferences()}><b>Take Quiz</b></button></div>
      </div>
    )
  }
}

export default withRouter(Topics);