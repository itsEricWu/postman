import * as React from 'react';
import List from '@mui/material/List';
import CollapsedTask from './CollapsedTask';
import { Paper } from '@mui/material';

export default function NestedList(props) {
  // this is the mock up task data for the task feed
  const taskList = props.taskList;

  return (
    <Paper style={{ maxHeight: 550, overflow: 'auto' }}>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader">
        {taskList.map((task, index) => {
          if (task.isTaken === false && task.posterId !== localStorage.getItem('userId') && task.status !=='completed') {
            // ignore the taken task and the task posted by the current user
            return <CollapsedTask key={index} taskInfo={task} setTaskTaken={props.setTaskTaken} />;
          } else if (task.takerId === localStorage.getItem('userId') && task.status !=='completed') {
            return <CollapsedTask key={index} taskInfo={task} setTaskTaken={props.setTaskTaken} />
          } else {
            return null;
          }
        })}
      </List>
    </Paper>
  );
}
