import Section from '/public/js2/components/pages/section.js';
import LoginForm from '../forms/loginForm.js';
import UserController from '../../modules/userController.js';
import SectionSwitcher from '/public/js2/modules/userController.js';


class LoginSection extends Section {
    constructor() {
        super();
    }

    render() {
        this.formHeader = document.createElement('h2');
        this.formHeader.innerText = 'Sign In';

        this.loginForm = new LoginForm();

        this.login = document.createElement('div');
        this.login.id = 'loginSection';
        this.login.appendChild(this.formHeader);
        this.login.appendChild(this.loginForm);
        this.login.setOnSubmit(() => {
            const userData = this.loginForm.checkState();
            if (UserController.login(userData)) {
                SectionSwitcher.changeSection('menuSection', 'root1');
            }
        });

        return this.login;
    }
}

export default LoginSection;