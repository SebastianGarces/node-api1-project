// implement your API here
const express = require("express");
const cors = require("cors");
const { find, findById, insert, update, remove } = require("./data/db");

const server = express();
server.use(express.json());
server.use(cors());

// Create user

server.post("/api/users", async (req, res) => {
	const newUser = req.body;

	try {
		if (!newUser.bio || !newUser.name) {
			res.status(400).json({
				errorMessage: "Please provide name and bio for the user.",
			});
		} else {
			const newUserId = await insert(newUser);
			const newUserObj = await findById(newUserId.id);
			res.status(201).json(newUserObj);
		}
	} catch (error) {
		res.status(500).json({
			errorMessage:
				"There was an error while saving the user to the database",
		});
	}
});

// Get Users

server.get("/api/users", async (req, res) => {
	try {
		const users = await find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({
			errorMessage: "The users information could not be retrieved.",
		});
	}
});

// Get User By ID

server.get("/api/users/:id", async ({ params: { id } }, res) => {
	try {
		const user = await findById(id);
		if (!user) {
			res.status(404).json({
				message: "The user with the specified ID does not exist.",
			});
		} else {
			res.status(200).json(user);
		}
	} catch (error) {
		res.status(500).json({
			errorMessage: "The user information could not be retrieved.",
		});
	}
});

// Delete User

server.delete("/api/users/:id", async ({ params: { id } }, res) => {
	try {
		const deleted = await remove(id);
		if (deleted > 0) {
			res.status(200).json({
				message: "The user with the specified ID was deleted",
			});
		} else {
			res.status(404).json({
				message: "The user with the specified ID does not exist.",
			});
		}
	} catch (error) {
		res.status(500).json({ errorMessage: "The user could not be removed" });
	}
});

// Update User

server.put("/api/users/:id", async (req, res) => {
	const changes = req.body;
	const { id } = req.params;

	try {
		const userWasUpdated = await update(id, changes);
		if (userWasUpdated > 0) {
			res.status(200).json({
				message:
					"The user with the specefied ID was updated successfully",
			});
		} else if (!changes.name || !changes.bio) {
			res.status(400).json({
				errorMessage: "Please provide name and bio for the user.",
			});
		} else {
			res.status(404).json({
				message: "The user with the specified ID does not exist.",
			});
		}
	} catch (error) {
		res.status(500).json({
			errorMessage: "The user information could not be modified.",
		});
	}
});

const PORT = 5000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
