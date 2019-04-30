import React from "react";
import "./TaskList.css";
import {
    Paper,
    Button,
    List,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@material-ui/core";
import TaskListItem from "./TaskListItem/TaskListItem";
import moment from "moment";

class TaskList extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            isTaskDialogOpen: false,
            titleInputValue: "",
            dateInputValue: moment().format("YYYY-MM-DD"),
            descriptionInputValue: "",
            dialogTitle: "",
            editableItemId: "",
        };
    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem("data")) || [];
        this.setState({ data });
    }

    onCreate = () => {
        this.setState({
            isTaskDialogOpen: true,
            editableItemId: "",
        });
    };

    closeDialog = () => {
        this.setState({
            isTaskDialogOpen: false,
            titleInputValue: "",
            dateInputValue: moment().format("YYYY-MM-DD"),
            descriptionInputValue: "",
        });
    };

    onSave = () => {
        const {
            titleInputValue,
            descriptionInputValue,
            dateInputValue,
            data,
            editableItemId,
        } = this.state;
        const item = {
            id: editableItemId || Date.now(),
            title: titleInputValue,
            date: dateInputValue,
            description: descriptionInputValue,
            checked: false,
        };
        if (editableItemId) {
            const newData = this.deepClone(this.state.data);
            const item = newData.find((task) => task.id === editableItemId);
            Object.assign(item, {
                title: titleInputValue,
                date: dateInputValue,
                description: descriptionInputValue,
            });
            this.setState({ data: newData }, this.updateLocalStorage);
        } else {
            this.setState(
                {
                    data: [item, ...data],
                },
                this.updateLocalStorage
            );
        }
        this.closeDialog();
    };

    onEdit = (id) => {
        const item = this.state.data.find((task) => task.id === id);
        this.setState({
            editableItemId: id,
            titleInputValue: item.title,
            dateInputValue: item.date,
            descriptionInputValue: item.description,
            isTaskDialogOpen: true,
        });
    };

    updateLocalStorage = () => {
        localStorage.setItem("data", JSON.stringify(this.state.data));
    };

    handleChange = (name) => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    resetDialogState = () => {
        this.setState({
            titleInputValue: "",
            dateInputValue: moment().format("YYYY-MM-DD"),
            descriptionInputValue: "",
        });
    };

    deepClone = (data) => {
        return JSON.parse(JSON.stringify(data));
    };

    onCheck = (id) => {
        const newData = this.deepClone(this.state.data);
        const item = newData.find((task) => task.id === id);
        item.checked = !item.checked;
        this.setState({ data: newData }, this.updateLocalStorage);
    };

    onMove = (id, direction) => {
        const data = this.deepClone(this.state.data);
        const index = data.findIndex((task) => task.id === id);
        if (direction === "up") {
            if (index !== 0) {
                [data[index - 1], data[index]] = [data[index], data[index - 1]];
            }
        } else {
            if (index !== this.state.data.length - 1) {
                [data[index], data[index + 1]] = [data[index + 1], data[index]];
            }
        }
        this.setState({ data }, this.updateLocalStorage);
    };

    render() {
        const {
            data,
            isTaskDialogOpen,
            titleInputValue,
            descriptionInputValue,
            dateInputValue,
        } = this.state;

        return (
            <>
                <Paper className="main">
                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        className="add-new-task"
                        onClick={this.onCreate}
                    >
                        Добавить
                    </Button>
                    <List className="list">
                        {data.map((item, index) => (
                            <TaskListItem
                                data={item}
                                key={item.id}
                                onCheck={() => this.onCheck(item.id)}
                                onEdit={() => this.onEdit(item.id)}
                                onMove={this.onMove}
                                position={
                                    data.length === 1
                                        ? "only"
                                        : index === 0
                                        ? "first"
                                        : index === data.length - 1
                                        ? "last"
                                        : "middle"
                                }
                            />
                        ))}
                    </List>
                </Paper>
                <Dialog
                    open={isTaskDialogOpen}
                    onClose={this.closeDialog}
                    className="dialog"
                >
                    <DialogTitle className="task-dialog-header">
                        {this.state.editableItemId
                            ? "Редактирование"
                            : "Создание"}
                    </DialogTitle>
                    <DialogContent>
                        <div className="title-and-date">
                            <TextField
                                label="Заголовок"
                                variant="outlined"
                                className="title-input"
                                value={titleInputValue}
                                onChange={this.handleChange("titleInputValue")}
                            />
                            <TextField
                                label="Deadline"
                                variant="outlined"
                                type="date"
                                value={dateInputValue}
                                onChange={this.handleChange("dateInputValue")}
                                required
                            />
                        </div>
                        <TextField
                            multiline
                            fullWidth
                            label="Описание"
                            variant="outlined"
                            value={descriptionInputValue}
                            onChange={this.handleChange(
                                "descriptionInputValue"
                            )}
                            rowsMax={6}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.closeDialog}>
                            Отмена
                        </Button>
                        <Button color="primary" onClick={this.onSave}>
                            Сохранить
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default TaskList;
