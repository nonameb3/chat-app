import React, { useState, useEffect, useReducer } from "react";
import { w3cwebsocket as W3CWebsocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";
import "antd/dist/antd.css";

import userReducer, { initialState, setIsLoggedIn, setUser } from "./reducer/userReducer";
const client = new W3CWebsocket("ws://127.0.0.1:8000");

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

function App() {
  const [store, dispatch] = useReducer(userReducer, initialState);
  const { userName, isLoggedIn } = store;

  const [messages, setMessage] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    client.onopen = () => console.log("Websocket Client is Connected!");
    client.onmessage = (message) => {
      const data = JSON.parse(message?.data);
      if (data.type === "message") {
        setMessage((msg) => [...msg, { msg: data.msg, user: data.user }]);
      } else {
        setMessage((msg) => [...msg, { msg: `${data.user} is connected.`, user: data.user, system: true }]);
      }
    };
  }, []);

  useEffect(() => {
    if (userName) {
      client.send(
        JSON.stringify({
          type: "userLogin",
          user: userName,
        })
      );
    }
  }, [userName]);

  function onClick(value) {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: userName,
      })
    );
    setSearchVal("");
  }

  function onLogin(value) {
    dispatch(setUser(value));
    dispatch(setIsLoggedIn(true));
  }

  return (
    <div className='App'>
      {isLoggedIn ? (
        <div>
          <div className='title' style={{ textAlign: "center" }}>
            <Text type='secondary' style={{ fontSize: "36px" }}>
              Websocket Chat
            </Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 50 }}>
            {messages.map((message) =>
              !message.system ? (
                <Card
                  key={message.msg}
                  style={{
                    width: 300,
                    margin: "16px 4px 0 4px",
                    alignSelf: userName === message.user ? "flex-end" : "flex-start",
                  }}
                  loading={false}>
                  <Meta
                    avatar={<Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>{message.user[0].toUpperCase()}</Avatar>}
                    title={message.user}
                    description={message.msg}
                  />
                </Card>
              ) : (
                <p key={message.msg} style={{ padding: 0, margin: "16px 4px 0 4px", paddingLeft: "5%" }}>
                  {userName !== message.user && message.msg}
                </p>
              )
            )}
          </div>
          <div className='bottom'>
            <Search
              placeholder='input message and send'
              enterButton='Send'
              value={searchVal}
              size='large'
              onChange={(e) => setSearchVal(e.target.value)}
              onSearch={(value) => onClick(value)}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: "200px 40px" }}>
          <Search placeholder='Enter Username' enterButton='Login' size='large' onSearch={(value) => onLogin(value)} />
        </div>
      )}
    </div>
  );
}

export default App;
