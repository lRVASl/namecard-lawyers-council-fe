import React, { useState } from "react";
import { Button, Col, Modal, Row, Table, Typography, message } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table/interface";
import { IDetailnamecard, TPagination } from "../../common";
import { axiosInstance } from "../../../configs/config";
import { NamecardService } from "../../services/e_name_card.service";
import { RestOutlined } from "@ant-design/icons";
import { EditUser } from "./EditUser";

export interface props {
  dataresult: IDetailnamecard[];
  loading: boolean;
  loadings: (valeu: boolean) => void;
}

export const TableUser: React.FC<props> = ({ dataresult, loading, loadings }): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [pagination, setPagination] = useState<TPagination>({
    current: 1,
    pageSize: 10,
  });
  const [isModalOpenDel, setIsModalOpenDel] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [number, setnumber] = useState<number>(0);
  const [getdataresult, setdataresult] = useState<IDetailnamecard>();

  const showModalDel = (e: string) => {
    setnumber(Number(e));
    setIsModalOpenDel(true);
  };
  const handleOkDel = async () => {
    const deleteusers = await namecardService.deleteUser(number);
    if (deleteusers) {
      message.success(`ลบสำเร็จ`);
      setIsModalOpenDel(false);
      loadings(true);
    }
  };
  const handleCancelDel = () => {
    setIsModalOpenDel(false);
  };

  const showModalEdit = (e: IDetailnamecard) => {
    setdataresult(e);
    setIsModalOpenEdit(true);
  };
  const handleOkEdit = async () => {
    const deleteusers = await namecardService.deleteUser(number);
    if (deleteusers) {
      message.success(`ลบสำเร็จ`);
      setIsModalOpenEdit(false);
      loadings(true);
    }
  };
  const handleCancelEdit = () => {
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

  const columns: ColumnsType<IDetailnamecard> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (event: string, row: IDetailnamecard, index: number) => {
        let skip = (pagination.current - 1) * pagination.pageSize;
        return index + skip + 1;
      },
    },
    { title: "ชื่อ (TH)", dataIndex: "name_th", key: "name_th" },
    { title: "สกุล (TH)", dataIndex: "lastname_th", key: "lastname_th" },
    { title: "ชื่อ (EN)", dataIndex: "name_en", key: "name_en" },
    { title: "สกุล (EN)", dataIndex: "lastname_en", key: "lastname_en" },
    { title: "ตำแหน่ง", dataIndex: "position", key: "position" },
    { title: "เบอร์โทรศัพท์", dataIndex: "phone_number", key: "phone_number" },
    { title: "อีเมล", dataIndex: "email", key: "email" },
    { title: "Line", dataIndex: "line", key: "line" },
    { title: "Facebook", dataIndex: "facebook", key: "facebook" },
    {
      title: "...",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      width: "10%",
      align: "center",
      render: (event: string, row: IDetailnamecard, index: number) => {
        return (
          <>
            <Row gutter={[8, 8]} justify={"center"}>
              <Col>
                <Button type="primary" onClick={() => showModalEdit(row)}>{`แก้ไข`}</Button>
              </Col>
              <Col>
                <Button type="primary" onClick={() => showModalDel(event)} danger>{`ลบ`}</Button>
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
            <RestOutlined style={{ fontSize: "72px", color: "red" }} />
          </Col>
          <Col span={24} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            <Typography>{`ยืนยันที่จะลบข้อมูลผู้ใช้งานท่านนี้ใช่ไหม ?`}</Typography>
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
      <Modal title={`แก้ไขข้อมูล`} open={isModalOpenEdit} footer={false} onCancel={handleCancelEdit}>
        <EditUser setIsModalOpenEdit={(e: boolean) => setIsModalOpenEdit(e)} loadings={(e: boolean) => loadings(e)} getdataresult={getdataresult} />
      </Modal>
      <Table
        size="small"
        loading={loading}
        dataSource={dataresult}
        columns={columns}
        rowKey={(e: IDetailnamecard) => e.id}
        scroll={{ x: "calc(500px + 100%)" }}
        onChange={onChange}
      />
    </div>
  );
};
