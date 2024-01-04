import { Button, Col, Form, Input, Modal, Row, Space, Upload, message, Image } from "antd";
import React, { useState } from "react";
import { axiosInstance } from "../../../configs/config";
import { NamecardService } from "../../services/e_name_card.service";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IDetailnamecard } from "../../common";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";

export interface props {
  setIsModalOpenEdit: (e: boolean) => void;
  loadings: (e: boolean) => void;
  getdataresult?: IDetailnamecard;
}

export const EditUser: React.FC<props> = ({ setIsModalOpenEdit, loadings, getdataresult }) => {
  const namecardService = NamecardService(axiosInstance);
  const [FORM] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [getImage, setImage] = useState<any>(getdataresult?.imagefile);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  FORM.setFieldValue(`name_th`, getdataresult?.name_th);
  FORM.setFieldValue(`lastname_th`, getdataresult?.lastname_th);
  FORM.setFieldValue(`name_en`, getdataresult?.name_en);
  FORM.setFieldValue(`lastname_en`, getdataresult?.lastname_en);
  FORM.setFieldValue(`position`, getdataresult?.position);
  FORM.setFieldValue(`phone_number`, getdataresult?.phone_number);
  FORM.setFieldValue(`email`, getdataresult?.email);
  FORM.setFieldValue(`line`, getdataresult?.line);
  FORM.setFieldValue(`facebook`, getdataresult?.facebook);

  const handleCancel = () => {
    setPreviewOpen(false);
    setIsModalOpenEdit(false);
    FORM.resetFields();
  };

  const onfinish = (event: IDetailnamecard) => {
    const body = {
      condition: {
        where: {
          id: Number(getdataresult?.id),
        },
        data: {
          ...event,
        },
      },
    };
    Modal.confirm({
      title: "คุณต้องการแก้ไขข้อมูลผู้ใช้งานใช่หรือไม่ ?",
      icon: <ExclamationCircleOutlined />,
      content: "กดยืนยันเพื่อแก้ไขข้อมูลผู้ใช้งาน",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const createusers = await namecardService.updateuser(body as any);
        if (createusers) {
          if (fileList.length >= 1) {
            const formData: any = new FormData();
            formData.append("images", fileList[0].originFileObj);
            const dataDeleteImage = await namecardService.deleteImageGhs(String(getdataresult?.member_number));
            if (dataDeleteImage) {
              const images = await namecardService.uploadNewImages(String(getdataresult?.member_number), formData);
            }
          }
          message.success(`แก้ไขข้อมูลผู้ใช้งานสำเร็จ`);
          setIsModalOpenEdit(false);
          loadings(true);
          FORM.resetFields();
        }
      },
      onCancel: async () => {
        loadings(false);
        setIsModalOpenEdit(false);
      },
    });
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
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isLt2M;
  };
  return (
    <div>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Form name="createuser" form={FORM} layout="vertical" onFinish={onfinish}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Form.Item label={`รูปภาพ :`}>
              <Row gutter={[8, 8]} style={{ justifyContent: "center", display: "flex" }}>
                <Space>
                  {getImage === null ? (
                    <></>
                  ) : fileList.length >= 1 ? null : (
                    <Col>
                      <Image src={getImage ? URL.createObjectURL(getImage) : ""} width={100} />
                    </Col>
                  )}
                  <Col>
                    <ImgCrop rotationSlider>
                      <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-circle"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChangePic}
                        beforeUpload={beforeUpload}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
                    </ImgCrop>
                  </Col>
                </Space>
              </Row>
            </Form.Item>
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
                    return Promise.reject(new Error("Please Input Phone Number"));
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
                  message: "Please input Email or is not valid E-mail!",
                },
              ]}
            >
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
