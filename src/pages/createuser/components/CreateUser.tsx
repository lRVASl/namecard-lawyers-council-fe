import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
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

  const handleCancel = () => setPreviewOpen(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`Upload`}</div>
    </div>
  );

  const onfinish = async (event: IDetailnamecard) => {
    const uuidNumber: string = uuidv4();
    const formData: any = new FormData();
    formData.append("images", fileList[0].originFileObj);
    const body = {
      data: {
        ...event,
        member_number: uuidNumber,
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
          const images = await namecardService.uploadNewImages(uuidNumber, formData);
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
