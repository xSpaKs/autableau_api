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
    let classroom_id = req.params.classroom_id;

    if (
        classroom_id == null ||
        classroom_id == "" ||
        !Number.isInteger(parseInt(classroom_id, 10))
    ) {
        return res.status(422).json({ error: "The classroom is not valid" });
    }

    classroom_id = parseInt(classroom_id, 10);

    connection.query(
        "SELECT * FROM classrooms WHERE id = (?)",
        [classroom_id],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length < 1) {
                return res
                    .status(404)
                    .json({ message: "This classroom does not exist" });
            }

            connection.query(
                "SELECT * FROM students WHERE classroom_id = (?)",
                [classroom_id],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error fetching classes from the database: " +
                                error.stack
                        );
                        return res
                            .status(500)
                            .json({ error: "Failed to fetch classes" });
                    }

                    return res.status(200).send(results);
                }
            );
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
    let classroom = req.params.classroom_id;

    if (student == null || student == "") {
        return res.status(422).json({ error: "There is no student name" });
    }

    if (
        classroom == null ||
        classroom == "" ||
        !Number.isInteger(parseInt(classroom, 10))
    ) {
        return res
            .status(422)
            .json({ message: "Classroom ID is not an integer" });
    }

    classroom = parseInt(classroom, 10);

    connection.query(
        "SELECT * FROM students WHERE name = (?) AND classroom_id = (?)",
        [student, classroom],
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
                return res.status(409).json({
                    error: "This student already exists in this classroom",
                });
            }

            connection.query(
                `INSERT INTO students (classroom_id, name) VALUES (?, ?)`,
                [classroom, student],
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
                        message: "Student added successfully",
                        results,
                    });
                }
            );
        }
    );
});

app.put("/classrooms/:id", (req, res) => {
    let classroom_id = req.params.id;
    let classroom_name = req.body.name;

    if (classroom_name == null || classroom_name == "") {
        return res.status(422).json({ error: "There is no classroom name" });
    }

    if (
        classroom_id == null ||
        classroom_id == "" ||
        !Number.isInteger(parseInt(classroom_id, 10))
    ) {
        return res
            .status(422)
            .json({ message: "Classroom ID is not an integer" });
    }

    classroom_id = parseInt(classroom_id, 10);

    connection.query(
        "SELECT * FROM classrooms WHERE id = (?)",
        [classroom_id],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length < 1) {
                return res
                    .status(404)
                    .json({ message: "This classroom does not exist" });
            }

            connection.query(
                "SELECT * FROM classrooms WHERE name = (?)",
                [classroom_name],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error fetching classes from the database: " +
                                error.stack
                        );
                        return res
                            .status(500)
                            .json({ error: "Failed to fetch classes" });
                    }

                    if (results.length > 0) {
                        return res.status(409).json({
                            message: "Another classroom already has this name",
                        });
                    }

                    connection.query(
                        "UPDATE classrooms SET name = (?) WHERE id = (?)",
                        [classroom_name, classroom_id],
                        (error, results) => {
                            if (error) {
                                console.error(
                                    "Error fetching classes from the database: " +
                                        error.stack
                                );
                                return res
                                    .status(500)
                                    .json({ error: "Failed to fetch classes" });
                            }

                            return res.status(200).json({
                                message: "Classroom successfully updated",
                            });
                        }
                    );
                }
            );
        }
    );
});

app.put("/classrooms/:classroom_id/students/:student_id", (req, res) => {
    let classroom_id = req.params.classroom_id;
    let student_id = req.params.student_id;
    let student_name = req.body.name;

    if (student_name == null || student_name == "") {
        return res.status(422).json({ error: "There is no student name" });
    }

    if (
        classroom_id == null ||
        classroom_id == "" ||
        !Number.isInteger(parseInt(classroom_id, 10))
    ) {
        return res
            .status(422)
            .json({ message: "Classroom ID is not an integer" });
    }
    classroom_id = parseInt(classroom_id, 10);

    if (
        student_id == null ||
        student_id == "" ||
        !Number.isInteger(parseInt(student_id, 10))
    ) {
        return res
            .status(422)
            .json({ message: "Student ID is not an integer" });
    }
    student_id = parseInt(student_id, 10);

    connection.query(
        "SELECT * FROM classrooms WHERE id = (?)",
        [classroom_id],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length < 1) {
                return res
                    .status(404)
                    .json({ message: "This classroom does not exist" });
            }

            connection.query(
                "SELECT * FROM students WHERE name = (?) AND classroom_id = (?)",
                [student_name, classroom_id],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error fetching classes from the database: " +
                                error.stack
                        );
                        return res
                            .status(500)
                            .json({ error: "Failed to fetch classes" });
                    }

                    if (results.length > 0) {
                        return res.status(409).json({
                            message:
                                "Another student already has this name in this classroom",
                        });
                    }

                    connection.query(
                        "UPDATE students SET name = (?) WHERE id = (?) AND classroom_id = (?)",
                        [student_name, student_id, classroom_id],
                        (error, results) => {
                            if (error) {
                                console.error(
                                    "Error fetching classes from the database: " +
                                        error.stack
                                );
                                return res
                                    .status(500)
                                    .json({ error: "Failed to fetch classes" });
                            }

                            return res.status(200).json({
                                message: "Student successfully updated",
                            });
                        }
                    );
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
        return res
            .status(422)
            .json({ message: "Classroom ID is not an integer" });
    }

    classroomId = parseInt(classroomId, 10);

    connection.query(
        "SELECT * FROM classrooms WHERE id = (?)",
        [classroomId],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length < 1) {
                return res
                    .status(404)
                    .json({ error: "This classroom does not exist" });
            }
        }
    );

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

app.delete("/classrooms/:classroom_id/students/:student_id", (req, res) => {
    let classroomId = req.params.classroom_id;
    let student_id = req.params.student_id;

    if (
        classroomId == null ||
        classroomId == "" ||
        !Number.isInteger(parseInt(classroomId, 10))
    ) {
        return res
            .status(422)
            .json({ message: "This classroom does not exist" });
    }

    if (
        student_id == null ||
        student_id == "" ||
        !Number.isInteger(parseInt(student_id, 10))
    ) {
        return res.status(422).json({ message: "This student does not exist" });
    }

    classroomId = parseInt(classroomId, 10);
    student_id = parseInt(student_id, 10);

    connection.query(
        "SELECT * FROM students WHERE classroom_id = (?) AND id = (?)",
        [classroomId, student_id],
        (error, results) => {
            if (error) {
                console.error(
                    "Error fetching classes from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to fetch classes" });
            }

            if (results.length < 1) {
                return res.status(404).json({
                    error: "This student does not exist in this classroom",
                });
            }
        }
    );

    connection.query(
        `DELETE FROM students WHERE id = (?)`,
        [student_id],
        (error) => {
            if (error) {
                console.error(
                    "Error deleting class from the database: " + error.stack
                );
                return res
                    .status(500)
                    .json({ error: "Failed to delete student" });
            }

            return res
                .status(201)
                .json({ message: "Student deleted successfully" });
        }
    );
});

app.listen(5000, () => {
    console.log("Server started at port 5000");
});
