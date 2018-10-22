import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './features/App';
import Signup from './features/Signup';
import Home from './features/Home';


export default () => (
	<BrowserRouter>
		<App>
			<Switch>
				<Route exact path="/" component={ Home } />
				<Route path="/signup" component={ Signup } />
			</Switch>		
		</App>
	</BrowserRouter>
);
