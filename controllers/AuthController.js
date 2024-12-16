const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body;

        const userExits = await User.findOne({where: {email : email}})

        if (!userExits) {
            req.flash('message', {
                type: 'error',
                message: 'User not found.'
            })

            res.render('login')
            return;
        }

        const passwordMatch = bcrypt.compareSync(password, userExits.password)

        if (!passwordMatch) {
            req.flash('message', {
                type: 'error',
                message: 'Password invalid.'
            })

            res.render('login')
            return;
        }

        req.session.userid = userExits.id

            req.flash('message', {
                type: 'success',
                message: 'Authentication done successfully.'
            })
            req.session.save(() => {
                res.redirect('/');
            });
    }


    static register(req, res) {
        res.render('register')
    }

    static async registerPost(req, res) {
        const { name, email, password, passwordConfirm } = req.body;

        if (password != passwordConfirm) {
            req.flash('message', {
                type: 'error',
                message: 'Passwords doesn\'t match.'
            })
            res.render('register')
            return;
        }

        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', {
                type: 'error',
                message: 'This email has already been used.'
            })
            res.render('register')
            return;
        }

        const hashedPassword = bcrypt.hashSync(password);
        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            req.flash('message', {
                type: 'success',
                message: 'User registered with success.'
            })
            req.session.save(() => {
                res.redirect('/');
            });
        } catch (error) {
            res.redirect('/')
        }
    }

    static logout(req, res) {
        req.session.destroy()

        res.redirect('/login')
    }
}