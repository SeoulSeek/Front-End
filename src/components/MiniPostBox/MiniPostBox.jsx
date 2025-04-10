import React from "react";
import { Link } from "react-router";

import $ from "./MiniPostBox.module.css";
import MiniProfile from "../MiniProfile/MiniProfile";

const MiniPostBox = ({ id, title, username }) => {
  return (
    <li className={$.post}>
      <Link to={`/places/${id}`}>
        <div className={$.miniPostBox}>
          <MiniProfile username={username} />
          <h3 className={$.postTitle}>{title}</h3>
        </div>
      </Link>
    </li>
  );
};

export default MiniPostBox;
