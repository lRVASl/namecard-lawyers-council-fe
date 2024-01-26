import { Button, Col, Form, Input, Modal, Row, Space, Upload, message, Image } from "antd";
import React, { useState } from "react";
import { axiosInstance } from "../../../configs/config";
import { NamecardService } from "../../services/e_name_card.service";
import { PlusOutlined } from "@ant-design/icons";
import { IDetailnamecard } from "../../common";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";

export interface props {
  setIsModalOpenEdit: (e: boolean) => void;
  loadings: (e: boolean) => void;
  getdataresult?: IDetailnamecard;
  FORM: any;
  setFileList: (e: UploadFile[]) => void;
  fileList: any;
}

export const EditUser: React.FC<props> = ({ setIsModalOpenEdit, loadings, getdataresult, FORM, setFileList, fileList }) => {
  const namecardService = NamecardService(axiosInstance);

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
      message.error("กรุณากรอกข้อมูลอย่างน้อย 1 ข้อมูล");
      return;
    }
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
    const createusers = await namecardService.updateuser(body as any);
    if (createusers) {
      if (fileList.length != 0) {
        const formData: any = new FormData();
        formData.append("images", fileList[0].originFileObj);
        if (getdataresult?.imagefile) {
          const dataDeleteImage = await namecardService.deleteImageGhs(String(getdataresult?.member_number));
        }
        const images = await namecardService.uploadNewImages(String(getdataresult?.member_number), formData);
      }
      message.success(`แก้ไขข้อมูลผู้ใช้งานสำเร็จ`);
      setIsModalOpenEdit(false);
      loadings(true);
      FORM.resetFields();
    }
  };

  const validatePhone = (number: string) => {
    if (!number) {
      return true;
    }
    return /^[0-9]{1,10}$/.test(number);
  };
  const validateEmail = (mail: any) => {
    if (!mail) {
      return true;
    }
    return /\S+@\S+\.\S+/.test(mail);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`อัพโหลด`}</div>
    </div>
  );

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string) || (file.url as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isLt2M || Upload.LIST_IGNORE;
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
              <Row gutter={[8, 8]} style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                <Space>
                  {getdataresult?.imagefile === null ? (
                    <></>
                  ) : fileList.length >= 1 ? null : (
                    <Col style={{ justifyContent: "center", display: "flex", alignItems: "center", marginTop: "-10px" }}>
                      <Image
                        style={{ borderRadius: "6px" }}
                        src={getdataresult?.imagefile ? URL.createObjectURL(getdataresult?.imagefile) : ""}
                        width={100}
                      />
                    </Col>
                  )}
                  <Col style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                    <ImgCrop rotationSlider>
                      <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
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
            <Form.Item name={"name_th"} label={`ชื่อ (ไทย)`} rules={[{ required: true, message: "กรุณากรอกชื่อเป็นภาษาไทย" }]}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"lastname_th"} label={`นามสกุล (ไทย)`} rules={[{ required: true, message: "กรุณากรอกนามสกุลเป็นภาษาไทย" }]}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"name_en"} label={`ชื่อ (อังกฤษ)`} rules={[{ required: true, message: "กรุณากรอกชื่อเป็นภาษาอังกฤษ" }]}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"lastname_en"} label={`นามสกุล (อังกฤษ)`} rules={[{ required: true, message: "กรุณากรอกนามสกุลเป็นภาษาอังกฤษ" }]}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"position"} label={`ตำแหน่ง`} rules={[{ required: true, message: "กรุณากรอกตำแหน่ง" }]}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"phone_number"}
              label={`เบอร์โทรศัพท์`}
              rules={[
                {
                  required: true,
                  validator: async (_, storeValue) => {
                    if (validatePhone(storeValue)) {
                      if (storeValue === "" || storeValue === undefined || storeValue === null) {
                        return Promise.reject(new Error("กรุณากรอกเบอร์โทรศัพท์"));
                      } else {
                        return Promise.resolve(storeValue);
                      }
                    } else {
                      return Promise.reject(new Error("กรุณากรอกเบอร์โทรศัพท์"));
                    }
                  },
                },
              ]}
            >
              <Input placeholder="ข้อความ" maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"email"}
              label={`อีเมล`}
              rules={[
                {
                  required: true,
                  type: "email",
                  validator: async (_, storeValue) => {
                    if (validateEmail(storeValue)) {
                      if (storeValue === "" || storeValue === undefined || storeValue === null) {
                        return Promise.reject(new Error("กรุณากรอกอีเมล"));
                      } else {
                        return Promise.resolve(storeValue);
                      }
                    } else {
                      return Promise.reject(new Error("กรุณากรอกอีเมลให้ถูกต้อง"));
                    }
                  },
                },
              ]}
            >
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"line"} label={`Line ID`}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"facebook"} label={`Facebook`}>
              <Input placeholder="ข้อความ" />
            </Form.Item>
          </Col>
          <Col span={24} style={{ justifyContent: "center", display: "flex", marginBottom: "-30px" }}>
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
