const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "autableau",
    port: 3306,
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: " + err.stack);
        return;
    }
    console.log("Connected to the database as ID " + connection.threadId);
});

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get("/classrooms", function (req, res) {
    connection.query("SELECT * FROM classrooms", (error, results) => {
        if (error) {
            console.error(
                "Error fetching classes from the database: " + error.stack
            );
            return res.status(500).json({ error: "Failed to fetch classes" });
        }

        return res.status(200).send(results);
    });
});

app.get("/classrooms/:classroom_id/students", function (req, res) {
    connection.query(
        "SELECT * FROM students WHERE classroom_id = (?)",
        [req.params.classroom_id],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            return res.status(200).send(results);
        }
    );
});

app.post("/classrooms", function (req, res) {
    const classroom = req.body.name;

    if (classroom == null || classroom == "") {
        return res.status(422).json({ error: "There is no classroom name" });
    }

    connection.query(
        "SELECT * FROM classrooms WHERE name = (?)",
        [classroom],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length > 0) {
                return res
                    .status(409)
                    .json({ error: "This classroom already exists" });
            }

            connection.query(
                `INSERT INTO classrooms (name) VALUES (?)`,
                [classroom],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error inserting class into the database: " +
                                error.stack
                        );
                        return res
                            .status(500)
                            .json({ error: "Failed to insert class" });
                    }

                    return res.status(201).json({
                        message: "Classroom added successfully",
                        results,
                    });
                }
            );
        }
    );
});

app.post("/classrooms/:classroom_id/students", function (req, res) {
    const student = req.body.name;
    const classroom = req.params.classroom_id;

    if (student == null || student == "") {
        return res.status(422).json({ error: "There is no student name" });
    }

    connection.query(
        "SELECT * FROM classrooms WHERE name = (?)",
        [classroom],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length > 0) {
                return res
                    .status(409)
                    .json({ error: "This classroom already exists" });
            }

            connection.query(
                `INSERT INTO classrooms (name) VALUES (?)`,
                [classroom],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error inserting class into the database: " +
                                error.stack
                        );
                        return res
                            .status(500)
                            .json({ error: "Failed to insert class" });
                    }

                    return res.status(201).json({
                        message: "Classroom added successfully",
                        results,
                    });
                }
            );
        }
    );
});

app.delete("/classrooms/:id", (req, res) => {
    let classroomId = req.params.id;

    if (
        classroomId == null ||
        classroomId == "" ||
        !Number.isInteger(parseInt(classroomId, 10))
    ) {
        return res.status(422).json({ message: "ID is not an integer" });
    }

    classroomId = parseInt(classroomId, 10);

    connection.query("SELECT * FROM classrooms", (error, results) => {
        if (error) {
            console.error(
                "Error fetching classes from the database: " + error.stack
            );
            return res.status(500).json({ error: "Failed to fetch classes" });
        }

        if (!results.some((element) => element.id == classroomId)) {
            return res
                .status(404)
                .json({ error: "This classroom does not exist" });
        }
    });

    connection.query(
        `DELETE FROM classrooms WHERE id = (?)`,
        [classroomId],
        (error) => {
            if (error) {
                console.error(
                    "Error deleting class from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to delete class" });
            }

            return res
                .status(201)
                .json({ message: "Classroom deleted successfully" });
        }
    );
});

app.listen(5000, () => {
    console.log("Server started at port 5000");
});
