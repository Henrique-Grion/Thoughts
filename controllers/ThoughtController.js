const Thought = require('../models/Thought')
const User = require('../models/User')
const  { Op } = require('sequelize')

module.exports = class ThoughtController {
    static async showThoughts(req, res) {

        let search = req.query.search ? req.query.search : '';

        let order = req.query.order == 'old'
            ? 'ASC'
            : 'DESC'

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]],
        });

        const thoughts = thoughtsData.map((item) => item.get({ plain: true }));

        let thoughtsQty = thoughts.length ? thoughts.length : false;

        res.render('home', { thoughts, search, thoughtsQty })
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

        res.render('dashboard', {
            thoughts,
            scripts: [
                {
                    src: '/js/dashboard.js'
                }
            ]
        })
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

    static async removeThought(req, res) {
        try {
            const id = req.params.id
            const UserId = req.session.userid;

            await Thought.destroy({ where: { id, UserId: UserId } })

            req.flash('message', {
                type: 'success',
                message: 'Thought removed successfully.'
            })

            req.session.save(() => {
                res.status(200).send({ id: id });
            })
        } catch (error) {
            res.status(500);
        }
    }

    static async editThought(req, res) {
        const id = req.params.id;

        const thought = await Thought.findOne({ where: { id: id }, raw: true });

        console.log(thought)

        res.render('edit', { thought })
    }

    static async editThoughtSave(req, res) {
        try {
            await Thought.update({ title: req.body.title }, { where: { id: req.body.id } })

            req.flash('message', {
                type: 'success',
                message: 'Thought updated successfully.'
            })

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }
}