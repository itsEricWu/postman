import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ResponsiveAppBar from './ResponsiveAppBar';
import TaskTakerPanel from './TaskTakerPanel/index';
import TaskPosterPanel from './TaskPosterPanel/index';
import './homepage.css';

const HomePage = () => {
  // controller for switching between task taker and task poster page
  const [isTaskTakerMode, setIsTaskTakerMode] = useState(true);

  if (!localStorage.getItem('authenticated')) {
    return <Navigate to="/" replace={true} />;
  } else {
    return (
      <div className="homepage">
        <ResponsiveAppBar setIsTaskTakerMode={setIsTaskTakerMode} />
        {isTaskTakerMode ? <TaskTakerPanel /> : <TaskPosterPanel />}
      </div>
    );
  }
};
export default HomePage;
