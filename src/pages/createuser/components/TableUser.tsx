import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table, Typography, message, Image, Form, Avatar, Space } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table/interface";
import { IDetailnamecard, TPagination } from "../../common";
import { axiosInstance } from "../../../configs/config";
import { NamecardService } from "../../services/e_name_card.service";
import { CloudDownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { EditUser } from "./EditUser";
import { UploadFile } from "antd/lib/upload/interface";
import { UserOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import trashOutline from "@iconify/icons-ion/trash-outline";

export interface props {
  dataresult: IDetailnamecard[];
  loading: boolean;
  loadings: (valeu: boolean) => void;
}

export const TableUser: React.FC<props> = ({ dataresult, loading, loadings }): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [FORM] = Form.useForm();
  const [pagination, setPagination] = useState<TPagination>({
    current: 1,
    pageSize: 10,
  });
  const [isModalOpenDel, setIsModalOpenDel] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [number, setnumber] = useState<number>(0);
  const [menberNumber, setMember_number] = useState<string>("");
  const [getdataresult, setdataresult] = useState<IDetailnamecard>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {}, [getdataresult]);

  const showModalDel = (e: string, member_number: string) => {
    setnumber(Number(e));
    setMember_number(member_number);
    setIsModalOpenDel(true);
  };
  const handleOkDel = async () => {
    const deleteusers = await namecardService.deleteUser(number, menberNumber);
    if (deleteusers) {
      message.success(`ลบผู้ใช้งานสำเร็จ`);
      setIsModalOpenDel(false);
      loadings(true);
    }
  };
  const handleCancelDel = () => {
    setIsModalOpenDel(false);
  };

  const showModalEdit = (event: any) => {
    setdataresult(event);
    setIsModalOpenEdit(true);
  };

  const handleCancelEdit = () => {
    FORM.resetFields();
    setFileList([]);
    setIsModalOpenEdit(false);
  };

  function onChange(pagination: TablePaginationConfig) {
    const { current, pageSize } = pagination;
    setPagination((prevState: any) => ({
      ...prevState,
      current: current || 1,
      pageSize: pageSize || 10,
    }));
  }

  const downloadQRCodePNG = async (event: IDetailnamecard) => {
    const container = await document.getElementById(`qr-gen${event.id}`);
    if (container) {
      html2canvas(container).then((canvas) => {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `${event.name_en}.png`;
        a.click();
      });
    }
  };

  const columns: ColumnsType<IDetailnamecard> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: "3%",
      align: "center",
      render: (event: string, row: IDetailnamecard, index: number) => {
        let skip = (pagination.current - 1) * pagination.pageSize;
        return index + skip + 1;
      },
    },
    {
      title: "รูปภาพ",
      dataIndex: "id",
      key: "id",
      width: "8%",
      align: "center",
      render: (event: string, row: IDetailnamecard, index: number) => {
        return (
          <div style={{ justifyContent: "center", display: "flex" }}>
            {row.imagefile ? (
              <Image src={URL.createObjectURL(row.imagefile)} width={80} style={{ borderRadius: "6px" }} />
            ) : (
              <Avatar
                shape="square"
                icon={<UserOutlined />}
                style={{ width: "80px", height: "80px", alignItems: "center", justifyContent: "center", display: "flex", fontSize: "60px" }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "ชื่อ - นามสกุล (ไทย)",
      dataIndex: "name_th",
      key: "name_th",
      render: (value: string, row: IDetailnamecard, index: number) => {
        return (
          <>
            <Space>
              <Typography>{row.name_th}</Typography>
              <Typography>{row.lastname_th}</Typography>
            </Space>
          </>
        );
      },
    },
    // { title: "นามสกุล (ไทย)", dataIndex: "lastname_th", key: "lastname_th" },
    // { title: "ชื่อ (อังกฤษ)", dataIndex: "name_en", key: "name_en" },
    {
      title: "ชื่อ - นามสกุล (อังกฤษ)",
      dataIndex: "lastname_en",
      key: "lastname_en",
      render: (value: string, row: IDetailnamecard, index: number) => {
        return (
          <>
            <Space>
              <Typography>{row.name_en}</Typography>
              <Typography>{row.lastname_en}</Typography>
            </Space>
          </>
        );
      },
    },
    { title: "ตำแหน่ง", dataIndex: "position", key: "position" },
    { title: "เบอร์โทรศัพท์", dataIndex: "phone_number", key: "phone_number" },
    { title: "อีเมล", dataIndex: "email", key: "email" },
    { title: "Line ID", dataIndex: "line", key: "line" },
    { title: "Facebook", dataIndex: "facebook", key: "facebook" },
    {
      title: "QR-Code",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      align: "center",
      width: "8%",
      render: (event: string, row: IDetailnamecard, index: number) => {
        return (
          <>
            <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
              <Row id={`qr-gen${event}`} style={{ width: "150px" }}>
                <Col span={24} style={{ justifyContent: "center", display: "flex", marginTop: "5px" }}>
                  <QRCode
                    key={event}
                    value={`${window.location.origin}/idcard?userId=${event}`}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="H"
                    size={80}
                  />
                </Col>
                <Col span={24} style={{ textAlign: "center", padding: "0px 5px 0px 5px" }}>
                  <div style={{ marginTop: "5px", fontSize: "12px", marginBottom: "10px" }}>{`${row.name_th} ${row.lastname_th}`}</div>
                </Col>
              </Row>
            </div>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <Button
                onClick={() => downloadQRCodePNG(row)}
                style={{
                  textAlign: "center",
                  marginTop: "-5px",
                }}
                size="small"
              >
                <CloudDownloadOutlined style={{ height: "5px" }} />
              </Button>
            </div>
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      width: "8%",
      align: "center",
      render: (event: string, row: IDetailnamecard, index: number) => {
        return (
          <>
            <Row gutter={[8, 8]} justify={"center"}>
              <Col>
                <Button type="primary" onClick={() => showModalEdit(row)}>{`แก้ไข`}</Button>
              </Col>
              <Col>
                <Button type="primary" onClick={() => showModalDel(event, String(row?.member_number))} danger>{`ลบ`}</Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* delete modal */}
      <Modal open={isModalOpenDel} footer={false} onCancel={handleCancelDel} width={"300px"}>
        <Row gutter={[8, 8]} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
          <Col span={24} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            <Icon icon={trashOutline} style={{ fontSize: "64px", color: "red" }} />
          </Col>
          <Col span={24} style={{ width: "100%", justifyContent: "center", display: "flex", textAlign: "center" }}>
            <Typography>{`คุณต้องการยืนยันการลบข้อมูลผู้ใช้งานนี้ใช่หรือไม่ ?`}</Typography>
          </Col>

          <Col>
            <Button type="primary" danger onClick={() => handleCancelDel()}>{`ยกเลิก`}</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => handleOkDel()}>{`ยืนยัน`}</Button>
          </Col>
        </Row>
      </Modal>
      {/* edit modal */}
      <Modal
        title={<div style={{ justifyContent: "center", display: "flex", marginBottom: "25px" }}>{`แก้ไขข้อมูลผู้ใช้งาน`}</div>}
        open={isModalOpenEdit}
        footer={false}
        onCancel={handleCancelEdit}
      >
        <EditUser
          setIsModalOpenEdit={(e: boolean) => setIsModalOpenEdit(e)}
          loadings={(e: boolean) => loadings(e)}
          getdataresult={getdataresult}
          FORM={FORM}
          setFileList={(e: any) => setFileList(e)}
          fileList={fileList}
        />
      </Modal>
      <Table
        size="small"
        loading={loading}
        dataSource={dataresult}
        columns={columns}
        rowKey={(e: IDetailnamecard) => e.id}
        scroll={{ x: "calc(800px + 100%)" }}
        onChange={onChange}
      />
    </div>
  );
};
