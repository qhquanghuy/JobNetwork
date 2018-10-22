import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './features/App';
import Signup from './features/Signup';
import Home from './features/Home';

export default () => (
	<BrowserRouter>
		<App>
			<Route exact path="/" component={ Home } />
			<Route path="user/login" component={ Signup } />
		</App>
	</BrowserRouter>
);
