import '../styles.css';
import React, { useState } from "react";
import {db, auth} from "../firebase/Database";
import { ref , child, get, set, update, push, onValue} from 'firebase/database';
import TableDatePicker from './DatePicker';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import enAU from 'date-fns/locale/en-AU';
import InputNumberComponent from './NumberInput';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from "recharts";
import moment from "moment";
import DateProcessing from "./DateProcessing";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class PushupCounter extends React.Component {

  constructor(props) {
    super(props);
    this.name= React.createRef();
    this.role= React.createRef();
    this.uid= React.createRef();
    
    this.handleChange = this.handleChange.bind(this);

    this.state = {
        user: auth,
        members: [],
        userData: {},
        date: new Date(),
        completed : 0,
        inputValue: 0,
        graphData: [],
        totalPushups: 0
    };  
  }

  componentDidMount() {
    registerLocale('en-AU', enAU);
    auth.onAuthStateChanged( (user) => {
      console.log(JSON.stringify(user));
      if (user != null) {
        this.setState({ user: user});
        this.getUserData();
        this.prepareDateForRecharts();
      } else {
        console.log('not logged in');
      }
    });
    console.log(JSON.stringify(auth));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {    
      //this.writeUserData();
    }
  }



  addUser = (user_uid) => {
        //push(ref(db, 'members/'),"date","40");
        set(ref(db, 'members/' + user_uid), {
            "16-02-2022": "40",
        });
    console.log("DATA SAVED");
  };

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date) {
        return [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
        ].join('-');
    }
    getDataByDate = () => {
        console.log(this.formatDate(this.state.date));
        if(this.state.userData.hasOwnProperty(this.formatDate(this.state.date))) {
            console.log('successful')
            const formattedDate = this.formatDate(this.state.date)
            this.setState({completed: this.state.userData[formattedDate]})
        }
        else {this.setState({ completed:0});}
    }

    getUserData = () => {
        //console.log(this.state.user.currentUser.uid);
        
        get(child(ref(db),"/members/" + auth.currentUser.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                this.state.userData = snapshot.val();
                const dataTrial = this.prepareDateForRecharts();
                console.log(dataTrial);
                this.setState({totalPushups: this.totalPushupsCompleted()})
            console.log(this.state.userData);
            } else {
            console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    convertDateStringToDate(dateString){
        var dateParts = dateString.split("-");
        // month is 0-based, that's why we need dataParts[1] - 1
        var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]); 
        return(dateObject);
    }

    handleChange(date) {
        console.log(date);
        this.setState({ date: date}, () => {
            this.getDataByDate();
        });
    }
  handleSubmit = event => {
    event.preventDefault();
    let name = this.name;
    let role = this.role;
    let uid = this.uid;

    this.name = "";
    this.role = "";
    this.uid = "";
  };

  updateData = () => {
    //Get date
    //this.formatDate(this.state.date);
    //Get input value
    //this.state.inputValue
    //this.state.userData[this.formatDate(this.state.date)] = parseInt(this.state.completed) + parseInt(this.state.inputValue);
    var tempJSON = this.state.userData;
    tempJSON[this.formatDate(this.state.date)] = parseInt(this.state.completed) + parseInt(this.state.inputValue);
    this.setState({userData: tempJSON},() => this.submitData(this.state.userData))
    this.getDataByDate();
    this.prepareDateForRecharts();
    console.log(this.state.userData);
};

  submitData = (data) => {
    set(ref(db, 'members/' + auth.currentUser.uid), data)
      .then(() => {this.getDataByDate()})
      .then(() =>{this.prepareDateForRecharts()});
    console.log("JSON DATA SAVED");
};

updateInputValue(evt) {
    const val = evt.target.value;
    // ...
    this.setState({
      inputValue: val
    });
  }

  incrementInputValue(val) {
      this.setState({
          inputValue: parseInt(this.state.inputValue) + val
      })
  }

  calculateDay(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    //console.log('Day of year: ' + day);
    return (day);
  }

  totalPushupsCompleted() {
    const userData = this.state.userData
    var sum = 0;
    for( var el in userData ) {
        if( userData.hasOwnProperty( el ) ) {
        sum += parseFloat( userData[el] );
        }
    }
    return sum;
  }

  prepareDateForRecharts() {
    get(child(ref(db),"/members/")).then((snapshot) => {
        if (snapshot.exists()) {
            const codes = Object.entries(snapshot.val())
            .map(([key, value]) => { 
              const userData = Object.entries(value).map(([key2,value2]) => {
                    return {date: this.convertDateStringToDate(key2), count: value2};
                })
                console.log(JSON.stringify(userData));
                console.log(key + ': ' + value);
                const graphData = DateProcessing(userData);
                console.log(JSON.stringify(graphData));
                return {uid: key, data: graphData}
            });
            this.setState({graphData: codes});
            console.log(this.state.graphData);
        } else {
        console.log("No data available");
        }
        }).catch((error) => {
            console.error(error);
        });
    }

    formatXAxis = (tickItem) => {
      return moment(tickItem).format('YYYY-MM-DD');
    }
    

  render() {
    return (
      <React.Fragment>
        <div className="general-container">
            <h1 className="general-container">Day {this.calculateDay(this.state.date)}</h1>
          <div className="general-container">
            <span className="general-container">Graph of progress</span>
            <LineChart
              width={500}
              height={300}
              //data={this.state.graphData}
              margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
              }}
              >
              {this.state.graphData.map((s) => (
                  console.log(s.data),
                  <Line dataKey="count" data={s.data} name={s.uid} key={s.date} stroke="#82ca9d" />
              ))}
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="date"  tickFormatter={this.formatXAxis} />
              <YAxis dataKey="count" />
              <Tooltip />
              <Legend />
              
            </LineChart>
          </div>
          <div className="general-container">
            <h1>Log your pushups for the day</h1>
            <form onSubmit={this.handleSubmit}>
              <input type="hidden" ref="uid" />
              <div className="general-container">
                <label>Date</label>
                <button onClick={() => this.handleChange(new Date())}>Go to today</button>
                <DatePicker 
                    locale="en-AU" 
                    dateFormat="P"
                    selected={this.state.date} 
                    onChange={date => this.handleChange(date)} />
                <label>Pushups</label>
                <div className="progressBar">
                  <CircularProgressbar 
                    value={this.state.completed} 
                    maxValue={this.calculateDay(new Date())} 
                    text={`${this.state.completed}/${this.calculateDay(new Date())}`} 
                  />;
                </div>
                <InputNumberComponent/>
                  
                <div className="integerIncremenetBox">
                  <button
                      onClick={() => this.incrementInputValue(10)}>
                          +10
                  </button>
                  <input
                    type="number"
                    ref="role"
                    className="form-control"
                    placeholder="How many to add?"
                    value={this.state.inputValue}
                    onChange={evt => this.updateInputValue(evt)}
                  />
                  <button
                      onClick={() => this.incrementInputValue(-10)}>
                          -10
                  </button>
                </div>
                <button
                    onClick={() => this.incrementInputValue(this.calculateDay(this.state.date)-this.state.inputValue-parseInt(this.state.completed))}>
                        Finished today!
                </button>
                <button onClick={() => this.updateData()}  className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
          <h3 className="general-container">
            Pushups to date: {this.calculateDay(new Date())*(this.calculateDay(new Date())+1)/2}
          </h3>
            Pushups infront: {this.state.totalPushups-this.calculateDay(new Date())*(this.calculateDay(new Date())+1)/2}
        </div>
      </React.Fragment>
    );
  }
}

export default PushupCounter;