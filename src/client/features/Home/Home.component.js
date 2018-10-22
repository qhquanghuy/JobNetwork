/*
 * File: Home.component.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:43:59 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 12:10:00 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */


import React from 'react';
import { Link } from 'react-router-dom';
import Signup from '../Signup';
const Home = () => (
	<div>
        <h3>Home page</h3>
        <Link to="/user/login">login</Link>
    </div>
);

export default Home;



