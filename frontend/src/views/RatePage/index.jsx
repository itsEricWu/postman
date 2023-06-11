import React from 'react';
import { useState, useEffect} from 'react';
import { FaStar } from 'react-icons/fa';
import ResponsiveAppBar from '../TopBar/TopBar';
import { useLocation } from 'react-router-dom';
import apis from '../../apis/user';
import { useNavigate } from 'react-router-dom';
import {Button} from '@material-ui/core';
const RatePage = () => {
  const navigate = useNavigate();
  const route = useLocation();
  const [imageURL, setImageURL] = useState(null);
  const taskId = route.search.split('=')[1].split("&")[0];
  const posterId = route.search.split('=')[2];
  const [taskInfo, setTaskInfo] = useState({});
  const colors = {
    orange: '#FFBA5A',
    grey: '#a9a9a9'
  };

  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [upload,setUpload] = useState(false);
  const stars = Array(5).fill(0);
  const hiddenFileInput = React.useRef(null);
  useEffect(() => {
    if (taskId) {
      // TODO: get task info from backend
      apis.GetTask(taskId).then((res) => {
        console.log(res[0]);
        setTaskInfo(res[0]);
      });
    }
  }, [taskId]);
  
  const handleClick = (value) => {
    setCurrentValue(value);
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };
  const handleSubmit = (e) => {
    if (upload === false) {
      alert("You must upload a Image");
    } else {
      e.preventDefault();
      console.log("POSTERID"+posterId);
      apis.FinduserByEmail({ email: posterId }).then((res) => {
        const rating = res[0].rating;
        const total = res[0].totalrating;
        const count = res[0].ratingcount;
        const newRating = (total + currentValue) / (count + 1);
        const newTotal = total + currentValue;
        const newCount = count + 1;
        const ratingpayload = {
          email: posterId,
          rating: newRating
        };
        apis.UpdateRating(ratingpayload).then((res) => {
          const totalpayload = {
            email: posterId,
            totalrating: newTotal
          };
          apis.UpdateTotalRating(totalpayload).then((res) => {
            const countpayload = {
              email: posterId,
              ratingcount: newCount
            };
            apis.UpdateRatingCount(countpayload).then((res) => {
              navigate('/homepage');
            });
          });
        });
      });
    }
  };
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };
  const handleup =()=>{
    hiddenFileInput.current.click();
  };
  const fileselectedHandler = (event) => {
    setUpload(true);
    const file = event.target.files[0];
    let overSize = false;
    if (file.size > 1024 * 512) {
      overSize = true;
    }
    if (overSize) {
      alert("Image size should not exceed 512KB");
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageURL(e.target.result);
        taskInfo.ImageUrl = e.target.result;
        apis.UpdateTask(taskInfo._id, taskInfo).then((res) => {
          console.log('taskComplete', res);
        });
      }
      reader.readAsDataURL(file);
    }
  };
  return (
    <div style={styles.container}>
      <ResponsiveAppBar />
      <h2> Rate your Orders </h2>
      <div style={styles.stars}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
              style={{
                marginRight: 10,
                cursor: 'pointer'
              }}
            />
          );
        })}
      </div>
      <textarea placeholder="What's your experience?" style={styles.textarea} />
      {imageURL !== null ? <img
      alt="Provence"
      src={imageURL}
      style={{
        width: 300,
        height: 300,
      }}
    ></img> : null}
      <Button
      style={styles.button}
      onClick={handleup}
    >
      Upload the image to prove You Finished the Task
      <input type="file" hidden onChange={fileselectedHandler} ref = {hiddenFileInput} />
    </Button>
      <Button style={styles.button} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stars: {
    display: 'flex',
    flexDirection: 'row'
  },
  textarea: {
    border: '1px solid #a9a9a9',
    borderRadius: 5,
    padding: 10,
    margin: '20px 0',
    minHeight: 100,
    width: 300
  },
  button: {
    border: '1px solid #a9a9a9',
    borderRadius: 5,
    width: 300,
    padding: 10
  }
};

export default RatePage;
