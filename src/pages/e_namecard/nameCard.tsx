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
import { PhoneFilled, MailFilled, UserOutlined } from "@ant-design/icons";
import lineAppFill from "@iconify/icons-mingcute/line-app-fill";
import locationIcon from "@iconify/icons-zondicons/location";
import facebookIcon from "@iconify/icons-fe/facebook";
// logo and css
import Logo from "./images/lawyer_card.png";
import "./index.css";

export const NameCard: React.FC<{}> = (): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [searchParams] = useSearchParams();
  let userId: string | null = searchParams.get("userId");
  const [data, setData] = useState<IDetailnamecard>();

  useEffect(() => {
    fectdata();
  }, []);
  const fectdata = async () => {
    const resEvents = await namecardService.findMemberByID(Number(userId));
    if (resEvents) {
      let getImages: any = [];
      if (resEvents[0].images_namecard.length !== 0) {
        getImages = await namecardService.getImages(resEvents[0].images_namecard[0]?.idfile);
      }
      setData({ ...resEvents[0], imagefile: getImages });
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
            {data?.imagefile.length !== 0 ? (
              <Avatar
                className="avatar"
                src={URL.createObjectURL(data?.imagefile)}
                style={{
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderWidth: "2px",
                  backgroundColor: "lightgray",
                }}
              />
            ) : (
              <Avatar
                src="error"
                // fallback="data:image/png;base64,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"
                icon={<UserOutlined />}
                className="avatar"
                style={{ fontSize: "100px", alignItems: "center", paddingTop: "21px" }}
              />
            )}
            <Typography className="typoHeader">{data?.name_th ? `${data?.name_th}  ${data?.lastname_th}` : "-"}</Typography>
            <Typography className="typoHeader-en">{data?.name_en ? `( ${data?.name_en}  ${data?.lastname_en} )` : "-"}</Typography>
            <Typography className="typoDetail">{data?.position ? `${data?.position}` : "-"}</Typography>
            <div
              style={{
                padding: "20px 8px 20px 8px",
              }}
            >
              <Space className="iconContact">
                <PhoneFilled rotate={90} style={{ fontSize: "18px", color: "#2D43A6" }} />
                <Typography className="typodetail-contact">{data?.phone_number ? `${data?.phone_number}` : "-"}</Typography>
              </Space>
              <Space className="iconContact">
                <MailFilled style={{ color: "#2D43A6" }} />
                <Typography className="typodetail-contact">{data?.email ? `${data?.email}` : "-"}</Typography>
              </Space>
              <Space className="iconContact">
                <Icon icon={lineAppFill} style={{ color: "#2D43A6" }} />
                <Typography className="typodetail-contact">{data?.line === null || data?.line === "" ? "-" : `${data?.line}`}</Typography>
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
            <div style={{ justifyContent: "space-around", display: "flex" }}>
              <div>
                <Button type="link" onClick={() => handleCall()} className="divIcon">
                  <PhoneFilled className="icon" rotate={90} />
                </Button>
              </div>
              <div>
                <Button className="divIcon" type="link" href="https://goo.gl/maps/E4efpJkJA2RmXFXC8" target="_blank">
                  <Icon icon={locationIcon} className="icon" />
                </Button>
              </div>
              <div>
                <Button type="link" className="divIcon" onClick={() => handleSavemail()}>
                  <MailFilled className="icon" />
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
