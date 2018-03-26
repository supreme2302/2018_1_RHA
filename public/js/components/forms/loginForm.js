import Form from './form.js';
import Input from '../blocks/input.js';
import Button from '../blocks/button.js';
import Validator from "../../modules/validator.js";


/**
 * Class representing Login Form
 */
export default class LoginForm extends Form {
    /**
     * Creates generic form
     */
    constructor() {
        super();
    }

    /**
     * Return input data of the form
     * @return {{name: null, email: string, password: string}}
     */
    getData() {
        return {
            name: null,
            email: this.Email.getData(),
            password: this.Password.getData()
        }
    }

    /**
     * Renders and returns form DOM element
     * @return {*}
     */
    render() {
        this.Email = new Input({
            type: 'text',
            placeholder: 'email'
        });

        this.Password = new Input({
           type: 'password',
           placeholder: 'password'
        });

        this.InputSubmit = new Input({
            type: 'submit',
            value: 'Sign In'
        });



        this.Email.setOnInputChange(() => {
            Validator.checkMail(this.Email);
        });

        this.Password.setOnInputChange(() => {
            Validator.ckeckPass(this.Password);
        });


        this.formElement.appendChild(this.Email.render());
        this.formElement.appendChild(this.Password.render());
        this.formElement.appendChild(this.InputSubmit.render());

        return this.formElement;
    }

    /**
     * Defines behaviour on submit
     * @param {function} callbackfn – submit handler
     */
    setOnSubmit(callbackfn) {
        this.formElement.addEventListener('submit', (ev) => {
            ev.preventDefault();
            callbackfn();
        })
    }

}