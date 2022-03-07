/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:44:05 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 12:11:23 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */

import React from 'react';
import HomeComponent from './Home.component';
import { withRouter } from 'react-router-dom'

const Home = () => <HomeComponent />
export default withRouter(Home);

