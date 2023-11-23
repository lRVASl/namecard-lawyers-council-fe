import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Row, Typography, Image, Space } from "antd";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { saveAs } from "file-saver";
// type
import { IDetailnamecard } from "./common";
// Icon
import { Icon } from "@iconify/react";
import { PhoneFilled, MailFilled } from "@ant-design/icons";
import lineAppFill from "@iconify/icons-mingcute/line-app-fill";
import locationIcon from "@iconify/icons-zondicons/location";
import wwwIcon from "@iconify/icons-iconoir/www";
import baselineMail from "@iconify/icons-ic/baseline-mail";
import phoneBold from "@iconify/icons-solar/phone-bold";
// logo and css
import Logo from "../E-Namecard/images/Logo_OSD_white.png";
import "../E-Namecard/index.css";

export const NameCard: React.FC<{}> = (): React.ReactElement => {
  const [searchParams] = useSearchParams();
  let userId: string | null = searchParams.get("userId");
  const [data, setData] = useState<IDetailnamecard>();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user.php?userId=${userId}`, {
        headers: {
          Authorization: "Bearer osdadminapisuperkey",
        },
      })
      .then((result) => setData(result?.data));
  }, []);
  const saveContactToVCF = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${data?.fullName};;;;;;
FN:${data?.fullName}
ORG: OSD
TEL;TYPE=CELL:${data?.phone}
EMAIL:${data?.email}
X-LINE-ID:~${data?.lineId}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    saveAs(blob, `contact-${data?.fullName}.vcf`);
  };

  const handleCall = () => {
    window.location.href = `tel:${data?.phone}`;
  };

  const handleSavemail = () => {
    const mailtoLink = `mailto:${data?.email}?`;
    window.location.href = mailtoLink;
  };

  const handleSaveline = () => {
    const lineUrl = `https://line.me/ti/p/~${data?.lineId}`;
    window.open(lineUrl);
  };

  return (
    <>
      <Row className="mainBodypage" gutter={[8, 14]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Image src={Logo} width={200} preview={false} />
        </Col>
        <Col span={24} style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
          <Card className="cardIncontent" bodyStyle={{ padding: "5px" }}>
            <Avatar
              className="avatar"
              src={`https://econnect.osd.co.th/namecard/intra/${data?.userImage}`}
              style={{
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderWidth: "4px",
                backgroundColor: "lightgray",
              }}
            />
            <Typography className="typoHeader">{data?.fullname_En ? `${data?.fullname_En}` : ""}</Typography>
            <Typography className="typoHeader">{`${data?.fullName}`}</Typography>
            <Typography className="typoDetail">{`${data?.position}`}</Typography>
            <div
              style={{
                padding: "20px 8px 20px 8px",
              }}
            >
              <Space className="iconContact">
                <PhoneFilled rotate={90} style={{ fontSize: "18px" }} />
                <Typography className="typodetail-contact">{`${data?.phone}`}</Typography>
              </Space>
              <Space className="iconContact">
                <MailFilled />
                <Typography className="typodetail-contact">{`${data?.email}`}</Typography>
              </Space>

              {data?.userId !== "1" && data?.userId !== "2" && (
                <Space className="iconContact">
                  <Icon icon={lineAppFill} />
                  <Typography className="typodetail-contact">{data?.lineId === null ? "-" : `${data?.lineId}`}</Typography>
                </Space>
              )}
            </div>
            <Card
              className="cardinContentCard"
              bodyStyle={{
                padding: "5px 10px 5px 10px",
              }}
            >
              <Typography className="textincardcontentHead">{`OSD CO., LTD.`}</Typography>
              <Typography className="textincardcontent">{`24 Soi Ramintra 20, Ramintra Road, Tharang Bangkhen, Bangkok 10230 Thailand`}</Typography>
            </Card>
            <Row gutter={[0, 8]} className="divIcon">
              <Col>
                <Button type="link" onClick={() => handleCall()} className="divIcon">
                  <Icon icon={phoneBold} className="icon" />
                </Button>
              </Col>
              <Col>
                <Button type="link" className="divIcon" onClick={() => handleSavemail()}>
                  <Icon icon={baselineMail} className="icon" />
                </Button>
              </Col>
              {data?.userId !== "1" && data?.userId !== "2" && (
                <Col>
                  <Button
                    type="link"
                    onClick={() => handleSaveline()}
                    className="divIcon"
                    target="_blank"
                    disabled={data?.lineId === null ? true : false}
                  >
                    <Icon icon={lineAppFill} className="icon" />
                  </Button>
                </Col>
              )}
              <Col>
                <Button className="divIcon" type="link" href="https://goo.gl/maps/E4efpJkJA2RmXFXC8" target="_blank">
                  <Icon icon={locationIcon} className="icon" />
                </Button>
              </Col>
              <Col>
                <Button className="divIcon" type="link" href="https://www.osd.co.th/th/osd-th/" target="_blank">
                  <Icon icon={wwwIcon} className="icon" />
                </Button>
              </Col>
            </Row>
            <Button type="default" className="button" onClick={saveContactToVCF}>
              {`Save Contact`}
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};
