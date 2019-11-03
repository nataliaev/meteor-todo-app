import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  Grid
} from "@material-ui/core";

import { Tasks } from "../api/tasks.js";

import Task from "./Task.js";
import TopMenu from "./TopMenu";
import LeftMenu from './LeftMenu'

const styles = {
  paper: { margin: "auto", padding: 20, maxWidth: 450 },
  form: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-evenly"
  },
  root: {
    flexGrow: 1,
    padding: 25
  }
};

class TaskList extends Component {
  state = {
    title: ""
  };

  handleSubmit(event) {
    event.preventDefault();

    Tasks.insert({
      text: this.state.title,
      createdAt: new Date() // current time
    });

    // Clear form
    this.setState({
      title: ""
    });
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  renderTasks() {
    return this.props.tasks.map(task => <Task key={task._id} task={task} />);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <TopMenu />
        <Grid container className={classes.root} spacing={2}>
          <LeftMenu />
          <Grid item xs={12} sm={10}>
            <Paper className={classes.paper}>
              <Typography variant="h4" align="center" gutterBottom>
                Tasks for today
              </Typography>
              <form
                onSubmit={this.handleSubmit.bind(this)}
                className={classes.form}
              >
                <TextField
                  name="title"
                  label="Task"
                  value={this.state.title}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
                <Button type="submit" color="primary" variant="contained">
                  Add task
                </Button>
              </form>
              <List>{this.renderTasks()}</List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(
  withTracker(() => {
    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch()
    };
  })(TaskList)
);
