import {sectionSwitcher} from './sectionSwitcher.js';

/**
 * Class representing router
 */
export default class Router {

	/**
	 * Creates router
	 * @param root
	 * @param global
	 * @return {Router|*}
	 */
	constructor(root, global) {

		if (Router.__instance) {
			return Router.__instance;
		}

		this.root = root;
		this.startRoot = document.getElementById('start');
		this.gameRoot = document.getElementById('game');
		this.map = {};
		this.global = global;
		this.active = null;

		Router.__instance = this;
	}

	/**
	 * adds new page to router
	 * @param path
	 * @param View
	 * @return {Router}
	 */
	add(path, View) {
		this.map[path] = new View(this.root);
		return this;
	}

	/**
	 * opens the page
	 * @param path
	 */
	open(path) {
		const view = this.map[path];
		let rootForSwitch;
		if (path === '/training' || path === '/multiplayer') {
			rootForSwitch =  this.gameRoot;
			this.startRoot.hidden = true;
			rootForSwitch.hidden = false;
		} else {
			rootForSwitch = this.root;
			this.startRoot.hidden = false;
			this.gameRoot.hidden = true;
		}

		if (!view.allowed()) {
			window.history.replaceState(null, '', '/');
			this.open('/');
			return;
		}
		if (window.location.pathname !== path) {
			window.history.pushState(null, '', path);
		}
		sectionSwitcher.changeSection(view.render(), rootForSwitch);
	}

	/**
	 * Starts the router
	 */
	start() {
		window.addEventListener('popstate', function () {
			this.open(window.location.pathname);
		}.bind(this));

		this.root.addEventListener('click', function (evt) {
			if (evt.target.tagName.toLowerCase() === 'a') {
				evt.preventDefault();
				window.history.pushState(null, '', evt.target.href);
				this.open(evt.target.pathname);
			}
		}.bind(this));
		this.open(window.location.pathname);
	}
}