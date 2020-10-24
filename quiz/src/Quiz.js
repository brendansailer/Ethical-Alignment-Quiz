import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { db } from './firebase';
import './quiz.css'
import {Redirect} from 'react-router-dom';
import logo from './images/logoBig.svg';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "#d30b0d" : "#428bca",
  color: "#FFFFFF",
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#cbcaca" : "#cbcaca",
  padding: grid,
  width: 250
});

class Quiz extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      selected: [],
      questionCategoryList: [],
      previousQuestions: {},
      move: false,
      question_category_show: '',
      question_category: '',
      blurb: '',
      desc: '',
      question_no: 0
    };
    console.log(this.state.items);
    this.moveToNextQuestion = this.moveToNextQuestion.bind(this);
  }

  async componentDidMount() {
    await this.getQuizTopics();
    await this.loadQuotes();
  }

  getQuizTopics = async () => {
    await db.collection("users").get().then((querySnapshot) => {
      // only one user for now
      let questionCategoryList = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const categoriesData = userData['categories'];
        // console.log(doc.id);
        // console.log(doc.data());
        // console.log(categoriesData);
        let totalPoints = 0;
        for (var cat in categoriesData){
          totalPoints += categoriesData[cat];
        }
        let questionsPerCat = [];
        for (var cat in categoriesData){
          questionsPerCat.push([cat, Math.min(Math.floor(10*categoriesData[cat] / totalPoints), 3)]);
        }

        for (let i = 0; i < questionsPerCat.length; i++){
          if (questionsPerCat[i][1] > 0){
            for (let j = 0; j < questionsPerCat[i][1]; j++){
              questionCategoryList.push(questionsPerCat[i][0]);
            }
          }
        }
        // console.log(questionsPerCat);
        // console.log(questionCategoryList);
      })
      this.setState({ questionCategoryList });
    });
  }

  loadQuotes = async () => {
    let items = [];
    const question_category = this.state.questionCategoryList.pop();
    this.setState({ question_category });
    const previousQuestions = this.state.previousQuestions;
    let question_no;
    switch (question_category) {
      case 'economy':
      this.setState({ question_category_show: 'Economy' });
      break;
      case 'education':
      this.setState({ question_category_show: 'Education' });
      break;
      case 'environment':
      this.setState({ question_category_show: 'Environment' });
      break;
      case 'guncontrol':
      this.setState({ question_category_show: 'Gun Control' });
      break;
      case 'healthcare':
      this.setState({ question_category_show: 'Health Care' });
      break;
    }
    if (question_category in this.state.previousQuestions) {
      question_no = previousQuestions[question_category]+1;
      this.setState({ previousQuestions: {...previousQuestions, [question_category]: previousQuestions[question_category]+1}});
    } else {
      question_no = 1;
      this.setState({ previousQuestions: {...previousQuestions, [question_category]: 1}});
    }
    this.setState({ question_no: `question${question_no}` });

    await db.collection("quotes").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === question_category) {
          const questions_dict = doc.data();
          console.log(questions_dict);
            for (var q in questions_dict){
              if (q === `question${question_no}`){
                console.log(questions_dict[q]);
                for (var candidate in questions_dict[q]) {
                  if (candidate !== 'blurb' && candidate !== 'desc'){
                    items.push({id: candidate, content: questions_dict[q][candidate]});
                  } else if (candidate === 'blurb'){
                    this.setState({ blurb: questions_dict[q][candidate] });
                  } else if (candidate === 'desc'){
                    this.setState({ desc: questions_dict[q][candidate] });
                  }
                }
              }
            }
        }
      });
    });
    console.log(items);
    this.setState({ items, selected: [] });
    console.log(this.state.items);
  }

  id2List = {
    droppable: 'items',
    droppable2: 'selected'
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = async (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {
        const items = reorder(
            this.getList(source.droppableId),
            source.index,
            destination.index
        );

        let state = { items };

        if (source.droppableId === 'droppable2') {
            state = { selected: items };
        }

        this.setState(state);
    } else {
        const result = move(
            this.getList(source.droppableId),
            this.getList(destination.droppableId),
            source,
            destination
        );

        this.setState({
            items: result.droppable,
            selected: result.droppable2
        });
    }
  };

  moveToNextQuestion = async () => {
    const t = this;
    let curr_total = {};
    let curr_responses = {};
    let doc_id;
    await db.collection("users").get().then((querySnapshot) => {
      // only one user for now
      querySnapshot.forEach((doc) => {
        doc_id = doc.id;
        curr_total = doc.data()['totals'];
        curr_responses = doc.data()['responses'];
      });
    });

    console.log(curr_total);
    console.log(curr_responses);
    curr_responses[this.state.question_category][this.state.question_no]['answered'] = true;
    const selected = this.state.selected;
    const points = [10, 6, 3, 1, 0];

    for (let i = 0; i < selected.length; i++){
      const candidate = this.state.selected[i]['id'];
      curr_responses[this.state.question_category][this.state.question_no][candidate] = i+1;
      curr_total[candidate] += points[i];
    }

    await db.collection("users").doc(doc_id).update({
      totals: curr_total,
      responses: curr_responses
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    if (this.state.questionCategoryList.length === 0){
      t.setState({ move: true });
    }
    this.loadQuotes();
  }

  render() {
    if (this.state.move){
      return <Redirect to='/results' />
    }
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="top">
          <h1>
            {`${this.state.question_category_show}: ${this.state.blurb}`}
          </h1>
          <p className='blurb'>{this.state.desc}</p>
          <br/>
        </div>
          <div className='smallBox'> 
            <p className='inst'>Rank the quotes based on how much you agree with each one.</p>
            <p className='inst'>You must rank all the quotes before moving onto the next issue.</p>
        </div>
          <br/>
  
        <div>
          <div className="left_col">
            <h2>
              Ranked Quotes
            </h2>
            <p>
              Agree with Most
            </p>
            <br/>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                  <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)} 
                      className='drop'>
                      {this.state.selected.map((item, index) => (
                          <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              className = 'drag'>
                              {(provided, snapshot) => (
                                  <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style
                                      )}>
                                      {item.content}
                                  </div>
                              )}
                          </Draggable>
                      ))}
                      {provided.placeholder}
                  </div>
              )}
            </Droppable>
            <br/>
            <p>
              Agree with Least
            </p>
          </div>
          <div className="right_col">
            <h2>
              Unranked Quotes
            </h2>
            <div>
              <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                          className='drop'>
                          {this.state.items.map((item, index) => (
                              <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                  className = 'drag'>
                                  {(provided, snapshot) => (
                                      <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(
                                              snapshot.isDragging,
                                              provided.draggableProps.style
                                          )}>
                                          {item.content}
                                      </div>
                                  )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable>
            </div>
          </div>
          <div className="center_div_quiz">
            <button type="button" className="buttonQuiz" onClick={() => this.moveToNextQuestion()} disabled={this.state.items.length != 0}>
              <b>{this.state.questionCategoryList.length > 0 ? 'Next Question' : 'See Results'}</b>
            </button>
            <img src={logo} alt="logo" className='mini'/>
          </div>
        </div>
      </DragDropContext>
    )
  }
}

export default Quiz;