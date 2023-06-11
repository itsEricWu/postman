import * as React from 'react';
import List from '@mui/material/List';
import { Box, Paper,Typography} from '@mui/material';
import { useState } from 'react';
import CollapsedTask from './tasks';

export default function NestedList(props) {
  const taskList = props.taskList;
  return (
    <Box>
        <List
            sx={{width: '100%', bgcolor: 'background.paper' }} 
            component="nav"
            aria-labelledby="nested-list-subheader">
            {taskList.map((task,index) => {
                if (task.posterId === localStorage.getItem('userId')) {
                    return (<CollapsedTask key={index} taskInfo={task} setTaskTaken={props.setTaskTaken} />)
                }
            })}
        </List>
    </Box>
  );
}