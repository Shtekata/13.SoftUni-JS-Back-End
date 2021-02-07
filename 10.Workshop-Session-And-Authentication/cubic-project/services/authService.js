import User from '../models/User.js';

const register = async (userData) => {

    userData.password !== userData.repeatPassword ? (() => { throw { message: 'Password missmatch!' }; })(): true;

    const user = new User(userData);
}

export default {
    register
}