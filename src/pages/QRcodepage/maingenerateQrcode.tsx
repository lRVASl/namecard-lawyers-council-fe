import React, { useState } from "react";
import { Button, Card, Col, Input, Row, Space, Typography } from "antd";
import { IDetail } from "./common";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import axios from "axios";
import QRCode from "qrcode.react";

export const MaingenerateQrcode: React.FC<{}> = (): React.ReactElement => {
  const { Search } = Input;
  const [data, setData] = useState<IDetail[]>([]);

  const onSearch = async (value: string) => {
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/users.php?userId=${value}`, {
        headers: {
          Authorization: "Bearer osdadminapisuperkey",
        },
      })
      .then((result) => {
        setData(result?.data);
      });
  };

  const downloadQRCode = (event: string) => {
    const canvas: any = document.getElementById(`qr-gens${event}`);
    const svgData = new XMLSerializer().serializeToString(canvas);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `[${event}].svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadQRCodePNG = (event: string) => {
    const canvas: any = document.getElementById(`qr-gen${event}`);
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `[${event}].png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <React.Fragment>
      <Card title={`การ generate QR-Code`}>
        <Search placeholder="input search username" enterButton="Search" size="large" onSearch={onSearch} style={{ marginBottom: "50px" }} />
        <div>
          <Typography
            style={{
              fontSize: "28px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >{`QR-CODE USER`}</Typography>
          <Row gutter={[8, 8]}>
            {data &&
              data?.map((event: IDetail) => {
                return (
                  <Col span={6} key={event?.empId}>
                    <Card style={{ width: "auto", backgroundColor: "white" }}>
                      <Row
                        style={{
                          justifyContent: "center",
                          textAlign: "center",
                          display: "flex",
                        }}
                      >
                        <Col span={24}>
                          <QRCode
                            id={`qr-gen${event.empId}`}
                            key={event?.empId}
                            value={`${window.location.origin}/namecard/idcard?userId=${event?.empId}`}
                          />
                        </Col>
                        <Col span={24} hidden>
                          <QRCode
                            id={`qr-gens${event.empId}`}
                            key={event?.empId}
                            value={`${window.location.origin}/namecard/idcard?userId=${event?.empId}`}
                            renderAs="svg"
                            level="H"
                          />
                        </Col>
                        <Col span={24}>{`[ ${event?.username} ]`}</Col>
                        <Col span={24} style={{ marginBottom: "10px" }}>{`[ ${event?.empId} ]`}</Col>
                        <Space>
                          <Button
                            onClick={() => downloadQRCode(event?.empId)}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {`SVG`}
                            <VerticalAlignBottomOutlined />
                          </Button>
                          <Button
                            onClick={() => downloadQRCodePNG(event?.empId)}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {`PNG`}
                            <VerticalAlignBottomOutlined />
                          </Button>
                        </Space>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </div>
      </Card>
    </React.Fragment>
  );
};
