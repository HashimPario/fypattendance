import axios from 'axios';
import { baseURL } from 'helper/constants';
import React from 'react';

const Test = () => {
  const ClickHandler = async () => {
    try {
      await axios.post(`${baseURL}/test`);
      alert('success');
    } catch (error) {
      throw new Error(error as any);
    }
  };
  return (
    <>
      <button onClick={ClickHandler}>click</button>
      <div>This is a testing page</div>
    </>
  );
};

export default Test;
