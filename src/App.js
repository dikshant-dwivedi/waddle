import React from 'react';
import Timer from './components/clock/Timer.js'
import TodoList from './components/todo/TodoList.js'
import './App.css';

class App extends React.Component {

  constructor()
  {
    super()
    this.state = {
      
    }
  }

  

  render()
  {
    return (
      <main className="App">
        <Timer/>
        <TodoList/>
      </main>
    );
  }
}

export default App;
