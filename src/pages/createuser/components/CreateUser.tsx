import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { NamecardService } from "../../services/e_name_card.service";
import { axiosInstance } from "../../../configs/config";
import { v4 as uuidv4 } from "uuid";
import { IDetailnamecard } from "../../common";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

export interface props {
  setIsModalOpen: (event: boolean) => void;
  loading: (event: boolean) => void;
}

export const CreateUser: React.FC<props> = ({ setIsModalOpen, loading }): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [FORM] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };
  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setImageUrl(url);
    });
  };

  console.log(imageUrl);

  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onfinish = (event: IDetailnamecard) => {
    const body = {
      data: {
        ...event,
        member_number: uuidv4(),
      },
    };
    Modal.confirm({
      title: "ต้องการสร้าง User ใหม่ใช่หรือไม่ ?",
      icon: <ExclamationCircleOutlined />,
      content: "กดยืนยันเพื่อสร้าง User",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const createusers = await namecardService.createUser(body as any);
        if (createusers) {
          message.success(`สร้างผู้ใช้งานใหม่สำเร็จ`);
          setIsModalOpen(false);
          loading(true);
          FORM.resetFields();
        }
      },
      onCancel: async () => {
        loading(false);
        setIsModalOpen(false);
      },
    });
  };

  return (
    <div>
      <Form name="createuser" form={FORM} layout="vertical" onFinish={onfinish}>
        <Row gutter={[8, 8]}>
          <div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
            </Upload>
          </div>
          <Col span={12}>
            <Form.Item name={"name_th"} label={`ชื่อ (TH)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"lastname_th"} label={`นามสกุล (TH)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"name_en"} label={`ชื่อ (EN)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"lastname_en"} label={`นามสกุล (EN)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"position"} label={`ตำแหน่ง`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"phone_number"} label={`เบอร์โทรศัพท์`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"email"} label={`อีเมล`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"line"} label={`Line`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"facebook"} label={`Facebook`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={24} style={{ justifyContent: "center", display: "flex" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">{`ยืนยัน`}</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
