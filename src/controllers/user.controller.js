const User = require("../models/user.model");

const userController = {
    addUser: async(req, res) => {
        try {
            const { email, password: password_hash, status } = req.body
            const users = await User.create({ email, password_hash, status });
            return res.status(201).json(true);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }       
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'email', 'status'],
                order: [['id', 'DESC']],
                raw: true
            });
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedUser = await User.findByPk(id, {
                attributes: ['id', 'email', 'status'],
                raw: true
            });
            
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    updateUser: async(req, res) => {
        try {
            const { id } = req.params;
            
            const [updated] = await User.update({
                password_hash: req.body.password
            }, { where: { id }, individualHooks: true })

            if (!updated) return res.status(404).json({ message: 'User not found' });

            return res.status(200).json(true);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await User.destroy({ where : { id } });

            if (!deleted) return res.status(404).json({ message: 'User not found' });

            res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = userController;