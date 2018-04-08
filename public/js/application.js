'use strict';

import ProfileSection from './components/views/profileView/profileView.js';
import RatingSection from './components/views/ratingView/ratingView.js';
import RegisterSection from './components/views/registerView.js';
import LoginSection from './components/views/loginView/loginView.js';
import MenuSection from './components/views/menuView/menuView.js';
import Router from './modules/router.js';
import User from './modules/userModel.js';
import Game from './components/views/gameView/gameView.js';

const root = document.getElementById('application');
const globalRoot = document.getElementById('body');

User.auth()
	.then( () => {
		new Router(root, globalRoot)
			.add('/', MenuSection)
			.add('/register', RegisterSection)
			.add('/profile', ProfileSection)
			.add('/rating', RatingSection)
			.add('/login', LoginSection)
			.add('/game', Game)
			.start();
	})
	.catch();
//TODO: profile, rating