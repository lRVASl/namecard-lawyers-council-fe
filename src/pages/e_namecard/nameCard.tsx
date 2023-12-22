import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Row, Typography, Image, Space, Result } from "antd";
import { useSearchParams } from "react-router-dom";

import { saveAs } from "file-saver";
// type
import { IDetailnamecard } from "../common";
import { axiosInstance } from "../../configs/config";
import { NamecardService } from "../services/e_name_card.service";
// Icon
import { Icon } from "@iconify/react";
import { PhoneFilled, MailFilled } from "@ant-design/icons";
import lineAppFill from "@iconify/icons-mingcute/line-app-fill";
import locationIcon from "@iconify/icons-zondicons/location";
import baselineMail from "@iconify/icons-ic/baseline-mail";
import phoneBold from "@iconify/icons-solar/phone-bold";
import facebookIcon from "@iconify/icons-fe/facebook";
// logo and css
import Logo from "./images/lawyer_card.png";
import "./index.css";

export const NameCard: React.FC<{}> = (): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [searchParams] = useSearchParams();
  let userId: string | null = searchParams.get("userId");
  const [data, setData] = useState<IDetailnamecard>();
  const [getImage, setImage] = useState<any>();

  useEffect(() => {
    fectdata();
  }, []);
  const fectdata = async () => {
    const resEvents = await namecardService.findMemberByID(Number(userId));

    if (resEvents) {
      const data = await Promise.all(
        resEvents.map(async (event: any) => {
          const imageData = await dataImages(event);
          const mapData = {
            ...event,
            imagefile: imageData,
          };
          return mapData;
        }),
      );
      setData(data[0]);
    }
  };
  const dataImages = async (e: any) => {
    if (e.images_namecard.length >= 1) {
      const getImages = await namecardService.getImages(e.images_namecard[0]?.idfile);
      return getImages;
    } else {
      return null;
    }
  };

  const saveContactToVCF = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${`${data?.name_th}  ${data?.lastname_th}`};;;;;;
FN:${`${data?.name_th}  ${data?.lastname_th}`}
ORG: OSD
TEL;TYPE=CELL:${data?.phone_number}
EMAIL:${data?.email}
X-LINE-ID:~${data?.line}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    saveAs(blob, `contact-${`${data?.name_th}  ${data?.lastname_th}`}.vcf`);
  };

  const handleCall = () => {
    window.location.href = `tel:${data?.phone_number}`;
  };

  const handleSavemail = () => {
    const mailtoLink = `mailto:${data?.email}?`;
    window.location.href = mailtoLink;
  };

  const handleSaveline = () => {
    const lineUrl = `https://line.me/ti/p/~${data?.line}`;
    window.open(lineUrl);
  };

  return data ? (
    <>
      <Row className="mainBodypage" gutter={[8, 8]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Image src={Logo} width={200} preview={false} />
        </Col>
        <Col span={24} style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
          <Card className="cardIncontent" bodyStyle={{ padding: "5px" }}>
            <Avatar
              className="avatar"
              src={data ? URL.createObjectURL(data?.imagefile) : ""}
              style={{
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderWidth: "4px",
                backgroundColor: "lightgray",
              }}
            />
            <Typography className="typoHeader">{data ? `${data?.name_th}  ${data?.lastname_th}` : ""}</Typography>
            <Typography className="typoHeader-en">{data ? `( ${data?.name_en}  ${data?.lastname_en} )` : ""}</Typography>
            <Typography className="typoDetail">{`${data?.position}`}</Typography>
            <div
              style={{
                padding: "20px 8px 20px 8px",
              }}
            >
              <Space className="iconContact">
                <PhoneFilled rotate={90} style={{ fontSize: "18px", color: "#2D43A6" }} />
                <Typography className="typodetail-contact">{`${data?.phone_number}`}</Typography>
              </Space>
              <Space className="iconContact">
                <MailFilled style={{ color: "#2D43A6" }} />
                <Typography className="typodetail-contact">{`${data?.email}`}</Typography>
              </Space>
              <Space className="iconContact">
                <Icon icon={lineAppFill} style={{ color: "#2D43A6" }} />
                <Typography className="typodetail-contact">{data?.line === null ? "-" : `${data?.line}`}</Typography>
              </Space>
            </div>
            <Card
              className="cardinContentCard"
              bodyStyle={{
                padding: "5px 10px 5px 10px",
              }}
            >
              <Typography className="textincardcontentHead">{`สภาทนายความ ในพระบรมราชูปถัมภ์ `}</Typography>
              <Typography className="textincardcontentHead-red">{`Lawyers council of thailand under the royal patronage`}</Typography>
              <Typography className="textincardcontent">{`249 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพมหานคร 10220`}</Typography>
              <Typography className="textincardcontent">{`T : +662 522 7124 ถึง 27 , +662 522 7143 ถึง 47`}</Typography>
              <Typography className="textincardcontent">{`
ปรึกษากฎหมายสายด่วน 1167
`}</Typography>
              <Typography className="textincardcontent">{`
F : +662 522 7138`}</Typography>
            </Card>
            {/* <Row gutter={[0, 8]} className="divIcon"> */}
            <div style={{ justifyContent: "space-around", display: "flex" }}>
              <div>
                <Button type="link" onClick={() => handleCall()} className="divIcon">
                  <Icon icon={phoneBold} className="icon" />
                </Button>
              </div>
              <div>
                <Button className="divIcon" type="link" href="https://goo.gl/maps/E4efpJkJA2RmXFXC8" target="_blank">
                  <Icon icon={locationIcon} className="icon" />
                </Button>
              </div>
              <div>
                <Button type="link" className="divIcon" onClick={() => handleSavemail()}>
                  <Icon icon={baselineMail} className="icon" />
                </Button>
              </div>
              <div>
                <Button
                  type="link"
                  onClick={() => handleSaveline()}
                  className="divIcon"
                  target="_blank"
                  disabled={data?.line === null ? true : false}
                >
                  <Icon icon={lineAppFill} className="icon" />
                </Button>
              </div>
              <div>
                <Button className="divIcon" type="link" href="https://www.osd.co.th/th/osd-th/" target="_blank">
                  <Icon icon={facebookIcon} className="icon" />
                </Button>
              </div>
            </div>
            {/* </Row> */}
            <Button type="default" className="button" onClick={saveContactToVCF}>
              {`Save Contact`}
            </Button>
            <p style={{ marginTop: "10px", fontSize: "12px" }}>{`D-Namcard-Lawyers | Version: 1.0.0`}</p>
            <p style={{ marginTop: "-1  5px", fontSize: "12px" }}>{`Copyright ©2023 OSD`}</p>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Result status="404" title="404" subTitle="No Data UserID Number" />
    </>
  );
};
