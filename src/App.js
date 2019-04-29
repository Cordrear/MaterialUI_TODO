import React from "react";
import "./App.css";
import TaskList from "./components/TaskList/TaskList";

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <TaskList />
            </div>
        );
    }
}

export default App;
