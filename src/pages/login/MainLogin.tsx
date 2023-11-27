import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import React from "react";
import BG from "../../assets/images/BG_Login.jpg";
import Logo from "../../assets/images/12067497_4890274.jpg";
import { useNavigate } from "react-router-dom";

export const MainLogin: React.FC<{}> = ({}): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "100px",
        backgroundImage: `url(${BG})`,
        backgroundRepeat: "no-repeat, repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Card style={{ width: "100%", border: "none" }}>
        <Form name={`login`} layout={`vertical`}>
          <Row>
            <Col span={12} style={{ height: "500px" }}>
              <div style={{ justifyContent: "center", display: "flex" }}>
                <Typography style={{ fontSize: "48px", fontWeight: "bold", color: "grey" }}>Log In</Typography>
              </div>
              <Form.Item name={`username`} label={<div style={{ fontSize: "18px", fontWeight: "bold", color: "grey" }}>{`Username :`}</div>}>
                <Input placeholder="Username" style={{ height: "50px", borderRadius: "18px" }} />
              </Form.Item>
              <Form.Item name={`password`} label={<div style={{ fontSize: "18px", fontWeight: "bold", color: "grey" }}>{`Password :`}</div>}>
                <Input placeholder="Password" type="password" style={{ height: "50px", borderRadius: "18px" }} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary" style={{ width: "100%", borderRadius: "18px", height: "50px" }}>{`Log In`}</Button>
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={{
                backgroundImage: `url(${Logo})`,
                backgroundRepeat: "no-repeat, repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                width: "100%",
              }}
            />
          </Row>
        </Form>
      </Card>
    </div>
  );
};
