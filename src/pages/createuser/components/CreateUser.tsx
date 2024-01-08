import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Space, message } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { NamecardService } from "../../services/e_name_card.service";
import { axiosInstance } from "../../../configs/config";
import { v4 as uuidv4 } from "uuid";
import { IDetailnamecard } from "../../common";
import { Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";

export interface props {
  setIsModalOpen: (event: boolean) => void;
  loading: (event: boolean) => void;
}

export const CreateUser: React.FC<props> = ({ setIsModalOpen, loading }): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [FORM] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };
  const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
  };

  const handleCancel = () => {
    setPreviewOpen(false);
    setIsModalOpen(false);
    FORM.resetFields();
  };

  const validatePhone = (number: string) => {
    if (!number) {
      return true;
    }
    return /^[0-9]{1,10}$/.test(number);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`อัพโหลด`}</div>
    </div>
  );

  const onfinish = async (event: IDetailnamecard) => {
    if (
      (event.name_th === undefined || event.name_th === null) &&
      (event.lastname_th === null || event.lastname_th === undefined) &&
      (event.name_en === null || event.name_en === undefined) &&
      (event.lastname_en === null || event.lastname_en === undefined) &&
      (event.position === null || event.position === undefined) &&
      (event.phone_number === null || event.phone_number === undefined) &&
      (event.line === null || event.line === undefined) &&
      (event.facebook === null || event.facebook === undefined) &&
      fileList.length === 0
    ) {
      message.error("กรุณากรอกข้อมูลอย่งาน้อย 1 ข้อมูล");
      return;
    }
    const uuidNumber: string = uuidv4();
    const body = {
      data: {
        ...event,
        member_number: uuidNumber,
      },
    };
    Modal.confirm({
      title: "คุณต้องการสร้างผู้ใช้งานใหม่ใช่หรือไม่ ?",
      icon: <ExclamationCircleOutlined />,
      content: "กดยืนยันเพื่อสร้างผู้ใช้งานใหม่",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const createusers = await namecardService.createUser(body as any);
        if (createusers) {
          if (fileList.length > 0) {
            const formData: any = new FormData();
            formData.append("images", fileList[0].originFileObj);
            const images = await namecardService.uploadNewImages(uuidNumber, formData);
          }
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

  const beforeUpload = (file: RcFile) => {
    console.log(file);
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("Image must smaller than 20MB!");
    }
    return isLt2M;
  };

  return (
    <div>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Form name="createuser" form={FORM} layout="vertical" onFinish={onfinish}>
        <Row gutter={[8, 8]}>
          <Col span={24} style={{ justifyContent: "center", display: "flex", textAlign: "center", alignItems: "center" }}>
            <ImgCrop rotationSlider>
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </Col>
          <Col span={12}>
            <Form.Item name={"name_th"} label={`ชื่อ (ไทย)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"lastname_th"} label={`นามสกุล (ไทย)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"name_en"} label={`ชื่อ (อังกฤษ)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"lastname_en"} label={`นามสกุล (อังกฤษ)`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"position"} label={`ตำแหน่ง`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"phone_number"}
              label={`เบอร์โทรศัพท์`}
              rules={[
                {
                  required: false,
                  validator: async (_, storeValue) => {
                    if (validatePhone(storeValue)) {
                      return Promise.resolve(storeValue);
                    }
                    return Promise.reject(new Error("กรุณากรอกเบอร์โทรศัพท์"));
                  },
                },
              ]}
            >
              <Input placeholder="Text" maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"email"}
              label={`อีเมล`}
              rules={[
                {
                  required: false,
                  type: "email",
                  message: "กรุณากรอกอีเมลให้ถูกต้อง!",
                },
              ]}
            >
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"line"} label={`Line ID`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"facebook"} label={`Facebook`}>
              <Input placeholder="Text" />
            </Form.Item>
          </Col>
          <Col span={24} style={{ justifyContent: "center", display: "flex" }}>
            <Space>
              <Form.Item>
                <Button type="primary" danger onClick={() => handleCancel()}>{`ยกเลิก`}</Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">{`ยืนยัน`}</Button>
              </Form.Item>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
