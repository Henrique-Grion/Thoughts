const Thought = require('../models/Thought')
const User = require('../models/User')

module.exports = class ThoughtController {
    static showThoughts(req, res) {
        res.render('home')
    }

    static async dashboard(req, res) {

        const user = await User.findOne({
            where: {
                id: req.session.userid
            },
            include: Thought,
            plain: true
        })

        const thoughts = user.Thoughts.map((item) => item.dataValues);

        res.render('dashboard', { thoughts })
    }

    static createThought(req, res) {
        res.render('create')
    }

    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        };

        try {
            await Thought.create(thought)

            req.flash('message', {
                type: 'success',
                message: 'Thought created successfully.'
            })

            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            });
        } catch (error) {
            console.log(error)
        }
    }
}