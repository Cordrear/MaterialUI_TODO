import React from "react";
import "./TaskListItem.css";
import { ListItem, Checkbox, ListItemText, Button } from "@material-ui/core";
import {
    Edit as EditIcon,
    DeleteForever as DeleteForeverIcon,
    KeyboardArrowDown as DownIcon,
    KeyboardArrowUp as UpIcon,
} from "@material-ui/icons";
import moment from "moment";

export default (props) => {
    const { position, onCheck, onEdit, onDelete, onMove } = props;
    const { id, title, date, checked } = props.data;
    const deadline = moment(date);
    const daysLeft = deadline.diff(moment(), "days");
    let expirationClass = "common";
    if (daysLeft < 0) {
        expirationClass = "expired";
    } else if (daysLeft < 3) {
        expirationClass = "upcoming";
    }
    return (
        <ListItem key={id} className={!checked ? expirationClass : "completed"}>
            <Checkbox checked={checked} onClick={onCheck} />
            <ListItemText primary={title} className="list-item_title" />
            <ListItemText secondary={date} />
            <Button
                className="button"
                onClick={() => onMove(id, "down")}
                disabled={position === "last" || position === "only"}
            >
                <DownIcon />
            </Button>
            <Button
                className="button"
                onClick={() => onMove(id, "up")}
                disabled={position === "first" || position === "only"}
            >
                <UpIcon />
            </Button>
            <Button className="button" onClick={onEdit}>
                <EditIcon />
            </Button>
            <Button className="button" onClick={onDelete}>
                <DeleteForeverIcon />
            </Button>
        </ListItem>
    );
};
