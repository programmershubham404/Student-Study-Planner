/* =========================================
   STUDENT PLANNER
   ========================================= */


/* =========================================
   DATA
   ========================================= */

let tasks = JSON.parse(
    localStorage.getItem("studentTasks")
) || [];

let classes = JSON.parse(
    localStorage.getItem("studentClasses")
) || [];

let notes = JSON.parse(
    localStorage.getItem("studentNotes")
) || [];

let subjects = JSON.parse(
    localStorage.getItem("studentSubjects")
) || [];


/* =========================================
   SAVE DATA
   ========================================= */

function saveData() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "studentClasses",
        JSON.stringify(classes)
    );

    localStorage.setItem(
        "studentNotes",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "studentSubjects",
        JSON.stringify(subjects)
    );
}


/* =========================================
   PAGE NAVIGATION
   ========================================= */

const navItems = document.querySelectorAll(".nav-item[data-page]");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.dataset.page;

        showPage(page);

    });

});


function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.remove("active-page");

    });


    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.remove("active");

    });


    const activeButton =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );

    if (activeButton) {

        activeButton.classList.add("active");

    }


    const titles = {

        dashboard: "Dashboard",

        timetable: "Timetable",

        tasks: "Tasks",

        notes: "Notes",

        subjects: "Subjects"

    };

    document.getElementById("pageTitle").textContent =
        titles[pageName] || "Dashboard";

}


/* =========================================
   DATE
   ========================================= */

function displayDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    document.getElementById("currentDate")
        .textContent =
        date.toLocaleDateString(
            "en-US",
            options
        );

}

displayDate();


/* =========================================
   MODALS
   ========================================= */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


/* Close modal when clicking outside */

document.querySelectorAll(".modal-overlay")
    .forEach(overlay => {

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {

                overlay.classList.remove("show");

            }

        });

    });


/* =========================================
   TASKS
   ========================================= */

document
    .getElementById("taskForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const title =
            document.getElementById("taskTitle").value;

        const date =
            document.getElementById("taskDate").value;

        const priority =
            document.getElementById("taskPriority").value;


        const task = {

            id: Date.now(),

            title,

            date,

            priority,

            completed: false

        };


        tasks.push(task);

        saveData();

        renderTasks();

        updateDashboard();

        event.target.reset();

        closeModal("taskModal");

    });


function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) return;

    task.completed = !task.completed;

    saveData();

    renderTasks();

    updateDashboard();

}


function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveData();

    renderTasks();

    updateDashboard();

}


function renderTasks(filter = "all") {

    const container =
        document.getElementById("taskPageList");

    let filteredTasks = tasks;


    if (filter === "pending") {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );

    }


    if (filter === "completed") {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );

    }


    if (filteredTasks.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                🎉 No tasks here!
            </div>
        `;

        renderDashboardTasks();

        return;

    }


    container.innerHTML =
        filteredTasks
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .map(task => taskHTML(task))
            .join("");


    renderDashboardTasks();

}


function taskHTML(task) {

    return `

        <div class="task-item">

            <button
                class="task-checkbox ${task.completed ? "done" : ""}"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </button>

            <div class="task-info">

                <strong
                    style="${task.completed
                        ? "text-decoration:line-through;opacity:.5"
                        : ""
                    }"
                >
                    ${escapeHTML(task.title)}
                </strong>

                <small>
                    Due: ${formatDate(task.date)}
                </small>

            </div>

            <span class="priority ${task.priority}">
                ${capitalize(task.priority)}
            </span>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                ×
            </button>

        </div>

    `;

}


/* Filters */

document.querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            renderTasks(button.dataset.filter);

        });

    });


/* =========================================
   CLASSES
   ========================================= */

document
    .getElementById("classForm")
    .addEventListener("submit", event => {

        event.preventDefault();


        const subject =
            document.getElementById("classSubject").value;

        const day =
            document.getElementById("classDay").value;

        const time =
            document.getElementById("classTime").value;

        const room =
            document.getElementById("classRoom").value;


        const newClass = {

            id: Date.now(),

            subject,

            day,

            time,

            room

        };


        classes.push(newClass);

        saveData();

        renderTimetable();

        updateDashboard();

        event.target.reset();

        closeModal("classModal");

    });


function renderTimetable() {

    const body =
        document.getElementById("timetableBody");


    const times = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00"
    ];


    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ];


    body.innerHTML =
        times.map(time => {

            let row =
                `<tr>
                    <td>${formatTime(time)}</td>`;


            days.forEach(day => {

                const classItem =
                    classes.find(
                        c =>
                            c.day === day &&
                            c.time === time
                    );


                if (classItem) {

                    row += `

                        <td>

                            <div class="class-block">

                                <strong>
                                    ${escapeHTML(classItem.subject)}
                                </strong>

                                <small>
                                    ${escapeHTML(classItem.room || "")}
                                </small>

                            </div>

                        </td>

                    `;

                } else {

                    row += `<td></td>`;

                }

            });


            row += "</tr>";

            return row;

        }).join("");

}


/* =========================================
   NOTES
   ========================================= */

document
    .getElementById("noteForm")
    .addEventListener("submit", async event => {

        event.preventDefault();


        const title =
            document.getElementById("noteTitle").value;

        const subject =
            document.getElementById("noteSubject").value;

        const content =
            document.getElementById("noteContent").value;

        const files =
            Array.from(document.getElementById("noteAttachments").files);

        if (files.some(file => file.size > 2 * 1024 * 1024)) {

            alert("Each attachment must be 2 MB or smaller.");

            return;

        }

        const attachments =
            await Promise.all(files.map(file => readFileAsDataURL(file)));


        notes.push({

            id: Date.now(),

            title,

            subject,

            content,

            attachments

        });


        saveData();

        renderNotes();

        event.target.reset();

        closeModal("noteModal");

    });


function deleteNote(id) {

    notes = notes.filter(
        note => note.id !== id
    );

    saveData();

    renderNotes();

}


function renderNotes() {

    const container =
        document.getElementById("notesGrid");


    if (notes.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                📝 You haven't created any notes yet.

            </div>

        `;

        return;

    }


    container.innerHTML =
        notes.map(note => `

            <div class="note-card">

                <h3>
                    ${escapeHTML(note.title)}
                </h3>

                <div class="note-subject">
                    ${escapeHTML(note.subject || "General")}
                </div>

                <p>
                    ${escapeHTML(note.content)}
                </p>

                ${note.attachments?.length ? `
                    <div class="note-attachments">
                        ${note.attachments.map(attachment => `
                            <a
                                class="attachment-link"
                                href="${escapeHTML(attachment.dataUrl)}"
                                download="${escapeHTML(attachment.name)}"
                            >
                                📎 ${escapeHTML(attachment.name)}
                            </a>
                        `).join("")}
                    </div>
                ` : ""}

                <div class="note-actions">

                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");

}


function readFileAsDataURL(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.addEventListener("load", () => resolve({
            name: file.name,
            dataUrl: reader.result
        }));

        reader.addEventListener("error", reject);

        reader.readAsDataURL(file);

    });

}


/* =========================================
   SUBJECTS
   ========================================= */

document
    .getElementById("subjectForm")
    .addEventListener("submit", event => {

        event.preventDefault();


        const name =
            document.getElementById("subjectName").value;

        const teacher =
            document.getElementById("subjectTeacher").value;

        const color =
            document.getElementById("subjectColor").value;


        subjects.push({

            id: Date.now(),

            name,

            teacher,

            color

        });


        saveData();

        renderSubjects();

        updateDashboard();

        event.target.reset();

        closeModal("subjectModal");

    });


function deleteSubject(id) {

    subjects =
        subjects.filter(
            subject => subject.id !== id
        );

    saveData();

    renderSubjects();

    updateDashboard();

}


function renderSubjects() {

    const container =
        document.getElementById("subjectsGrid");


    if (subjects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                📚 Add your first subject.

            </div>

        `;

        return;

    }


    container.innerHTML =
        subjects.map(subject => `

            <div class="subject-card">

                <div
                    class="subject-color"
                    style="background:${subject.color}"
                ></div>

                <h3>
                    ${escapeHTML(subject.name)}
                </h3>

                <p>
                    Teacher:
                    ${escapeHTML(
                        subject.teacher || "Not added"
                    )}
                </p>

                <button
                    class="delete-btn"
                    onclick="deleteSubject(${subject.id})"
                    style="margin-top:15px"
                >
                    Delete
                </button>

            </div>

        `).join("");

}


/* =========================================
   DASHBOARD
   ========================================= */

function updateDashboard() {

    const today =
        new Date().toISOString().split("T")[0];


    const todayTasks =
        tasks.filter(
            task => task.date === today
        );


    const completed =
        tasks.filter(
            task => task.completed
        );


    const todayName =
        new Date().toLocaleDateString(
            "en-US",
            { weekday: "long" }
        );


    const todayClasses =
        classes.filter(
            c => c.day === todayName
        );


    document.getElementById("taskCount")
        .textContent =
        todayTasks.length;


    document.getElementById("classCount")
        .textContent =
        todayClasses.length;


    document.getElementById("completedCount")
        .textContent =
        completed.length;


    document.getElementById("subjectCount")
        .textContent =
        subjects.length;


    renderDashboardTasks();

    renderDashboardClasses();

}


function renderDashboardTasks() {

    const container =
        document.getElementById("dashboardTasks");


    const today =
        new Date().toISOString().split("T")[0];


    const todayTasks =
        tasks.filter(
            task => task.date === today
        );


    if (todayTasks.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                🎉 No tasks due today!

            </div>

        `;

        return;

    }


    container.innerHTML =
        todayTasks
            .slice(0, 5)
            .map(task => taskHTML(task))
            .join("");

}


function renderDashboardClasses() {

    const container =
        document.getElementById(
            "dashboardClasses"
        );


    const todayName =
        new Date().toLocaleDateString(
            "en-US",
            { weekday: "long" }
        );


    const todayClasses =
        classes
            .filter(c => c.day === todayName)
            .sort(
                (a, b) =>
                    a.time.localeCompare(b.time)
            );


    if (todayClasses.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                📅 No classes scheduled today.

            </div>

        `;

        return;

    }


    container.innerHTML =
        todayClasses
            .map(c => `

                <div class="schedule-item">

                    <div class="schedule-time">

                        ${formatTime(c.time)}

                    </div>

                    <div class="schedule-info">

                        <strong>
                            ${escapeHTML(c.subject)}
                        </strong>

                        <small>
                            ${escapeHTML(c.room || "Room not specified")}
                        </small>

                    </div>

                </div>

            `)
            .join("");

}


/* =========================================
   DARK MODE
   ========================================= */

document
    .getElementById("darkModeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "darkMode",
            document.body.classList.contains("dark")
        );

    });


if (
    localStorage.getItem("darkMode") === "true"
) {

    document.body.classList.add("dark");

}


/* =========================================
   UTILITIES
   ========================================= */

function formatDate(date) {

    if (!date) return "";

    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric"
            }
        );

}


function formatTime(time) {

    const [hour, minute] =
        time.split(":");

    const date =
        new Date();

    date.setHours(
        Number(hour),
        Number(minute)
    );

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


function capitalize(value) {

    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
   ========================================= */

renderTasks();

renderTimetable();

renderNotes();

renderSubjects();

updateDashboard();
