import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spin, Typography } from "antd";
import { TableUser } from "./components/TableUser";
import { CreateUser } from "./components/CreateUser";
import { axiosInstance } from "../../configs/config";
import { NamecardService } from "../services/e_name_card.service";
import { IDetailnamecard } from "../common";
import type { UploadFile } from "antd/es/upload/interface";

export const MainCreateUser: React.FC<{}> = ({}): React.ReactElement => {
  const [FORM] = Form.useForm();
  const namecardService = NamecardService(axiosInstance);
  const [getData, setData] = useState<IDetailnamecard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    fectdata();
  }, [loading]);

  const fectdata = async () => {
    const resEvents = await namecardService.findAllMember();
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
      setData(data);
    }
    setLoading(false);
  };
  const dataImages = async (e: any) => {
    if (e.images_namecard.length != 0) {
      const getImages = await namecardService.getImages(e.images_namecard[0].idfile);
      console.log(getImages);
      return getImages;
    } else {
      return null;
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    FORM.resetFields();
    setFileList([]);
  };

  return !loading ? (
    <div>
      <Modal
        title={<div style={{ justifyContent: "center", display: "flex ", marginBottom: "20px" }}>{"สร้างผู้ใช้งานใหม่"}</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <CreateUser
          setIsModalOpen={(e: boolean) => setIsModalOpen(e)}
          loading={(e: boolean) => setLoading(e)}
          FORM={FORM}
          setFileList={(e: any) => setFileList(e)}
          fileList={fileList}
        />
      </Modal>
      <Card style={{ width: "100%", justifyContent: "start", display: "flex", alignItems: "end" }}>
        <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>{`ผู้ใช้งาน`}</Typography>
      </Card>
      <Card style={{ width: "100%", marginTop: "10px" }}>
        <Row gutter={[8, 8]}>
          <Col span={24} style={{ justifyContent: "end", display: "flex" }}>
            <Button type="primary" onClick={showModal}>{`สร้างผู้ใช้งานใหม่`}</Button>
          </Col>
          <Col span={24}>
            <TableUser dataresult={getData} loading={loading} loadings={(e: boolean) => setLoading(e)} />
          </Col>
        </Row>
      </Card>
    </div>
  ) : (
    <>
      <Spin />
    </>
  );
};
