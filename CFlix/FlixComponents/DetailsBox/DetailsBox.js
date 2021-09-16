import React, {useContext} from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import "./DetailsBox.css";
import { UserContext } from "../../Context/userContext";

import {convertTime} from "../../utilities";
import { translateMyList } from "../../translate";

function DetailsBox() {
  const context = useContext(UserContext);
  
  return (
    <>
        <ScrollContainer className="scroll-container userInfoContainer">
          <Box
            title="Tv Time"
            data={[convertTime(context.userInfo.userInfo?.tvTime)["min"],convertTime(context.userInfo.userInfo?.tvTime)["h"], convertTime(context.userInfo.userInfo?.tvTime)["d"], convertTime(context.userInfo.userInfo?.tvTime)["month"]]}
            footer={translateMyList().time}
          />
          <Box title={translateMyList().tvWatched} data={[context.userInfo.userInfo?.tvCount]} footer={translateMyList().episode} />
          <Box
            title="Movie Time"
            data={[convertTime(context.userInfo.userInfo?.movieTime)["min"],convertTime(context.userInfo.userInfo?.movieTime)["h"], convertTime(context.userInfo.userInfo?.movieTime)["d"], convertTime(context.userInfo.userInfo?.movieTime)["month"]]}
            footer={translateMyList().time}
          />
          <Box title={translateMyList().movieWatched} data={[context.userInfo.userInfo?.movieCount]} footer={translateMyList().movie} />
        </ScrollContainer>
    </>
  );
}
export default DetailsBox;

export function Box(props) {
  return (
    <div className="Box">
      <div className="title">{props.title}</div>
      <div className="box-data">
        {props.data.map((item, index) => {
          return (
            <div className="box-data-text">
              <div className="box-data-body" style={{ color: "rgb(245,0,87)" }}>
                {item}
              </div>
              <div className="box-data-footer">{props.footer[index]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
