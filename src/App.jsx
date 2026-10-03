import React, { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    if (!savedStudents) {
      return [];
    }

    try {
      const parsedStudents = JSON.parse(savedStudents);
      return Array.isArray(parsedStudents) ? parsedStudents : [];
    } catch (error) {
      console.error("Could not read saved students from localStorage.", error);
      return [];
    }
  });

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  function clearForm() {
    setName("");
    setCourse("");
    setEmail("");
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const studentDetails = {
      name: name.trim(),
      course: course.trim(),
      email: email.trim(),
    };

    if (editingId !== null) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingId
            ? { ...student, ...studentDetails }
            : student
        )
      );
    } else {
      setStudents((currentStudents) => [
        ...currentStudents,
        { id: Date.now(), ...studentDetails },
      ]);
    }

    clearForm();
  }

  function editStudent(student) {
    setName(student.name);
    setCourse(student.course);
    setEmail(student.email);
    setEditingId(student.id);
  }

  function deleteStudent(id) {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id)
    );

    if (editingId === id) {
      clearForm();
    }
  }

  return (
    <main>
      <h1>Student Manager</h1>
      <p>Students: {students.length}</p>

      <section>
        <h2>{editingId !== null ? "Edit Student" : "Add Student"}</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="student-name">Name: </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </p>

          <p>
            <label htmlFor="student-course">Course: </label>
            <input
              id="student-course"
              type="text"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              required
            />
          </p>

          <p>
            <label htmlFor="student-email">Email: </label>
            <input
              id="student-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </p>

          <button type="submit">
            {editingId !== null ? "Save Changes" : "Add Student"}
          </button>
          {editingId !== null && (
            <button type="button" onClick={clearForm}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <h2>All Students</h2>
        {students.length === 0 ? (
          <p>No students added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.email}</td>
                  <td>
                    <button type="button" onClick={() => editStudent(student)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p>Student data is saved in this browser.</p>
    </main>
  );
}

export default App;
