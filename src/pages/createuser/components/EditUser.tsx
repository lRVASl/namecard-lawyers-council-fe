import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import React from "react";
import { axiosInstance } from "../../../configs/config";
import { NamecardService } from "../../services/e_name_card.service";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IDetailnamecard } from "../../common";

export interface props {
  setIsModalOpenEdit: (e: boolean) => void;
  loadings: (e: boolean) => void;
  getdataresult?: IDetailnamecard;
}

export const EditUser: React.FC<props> = ({ setIsModalOpenEdit, loadings, getdataresult }) => {
  const namecardService = NamecardService(axiosInstance);
  const [FORM] = Form.useForm();
  FORM.setFieldValue(`name_th`, getdataresult?.name_th);
  FORM.setFieldValue(`lastname_th`, getdataresult?.lastname_th);
  FORM.setFieldValue(`name_en`, getdataresult?.name_en);
  FORM.setFieldValue(`lastname_en`, getdataresult?.lastname_en);
  FORM.setFieldValue(`position`, getdataresult?.position);
  FORM.setFieldValue(`phone_number`, getdataresult?.phone_number);
  FORM.setFieldValue(`email`, getdataresult?.email);
  FORM.setFieldValue(`line`, getdataresult?.line);
  FORM.setFieldValue(`facebook`, getdataresult?.facebook);

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
      title: "ต้องการแก้ไขข้อมูล User ใช่หรือไม่ ?",
      icon: <ExclamationCircleOutlined />,
      content: "กดยืนยันเพื่อแก้ไขข้อมูล User",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const createusers = await namecardService.updateuser(body as any);
        if (createusers) {
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
  return (
    <div>
      <Form name="createuser" form={FORM} layout="vertical" onFinish={onfinish}>
        <Row gutter={[8, 8]}>
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
