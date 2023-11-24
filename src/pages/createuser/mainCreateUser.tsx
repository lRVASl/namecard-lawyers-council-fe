import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row, Spin, Typography } from "antd";
import { TableUser } from "./components/TableUser";
import { CreateUser } from "./components/CreateUser";
import { axiosInstance } from "../../configs/config";
import { NamecardService } from "../services/e_name_card.service";
import { IDetailnamecard } from "../common";

export const MainCreateUser: React.FC<{}> = ({}): React.ReactElement => {
  const namecardService = NamecardService(axiosInstance);
  const [getData, setData] = useState<IDetailnamecard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    fectdata();
  }, [loading]);
  const fectdata = async () => {
    const resEvents = await namecardService.findAllMember();
    setData(resEvents);
    setLoading(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return !loading ? (
    <div>
      <Modal title="New User" open={isModalOpen} onCancel={handleCancel} footer={false} width={1000}>
        <CreateUser setIsModalOpen={(e: boolean) => setIsModalOpen(e)} loading={(e: boolean) => setLoading(e)}  />
      </Modal>
      <Card style={{ width: "100%", justifyContent: "start", display: "flex", alignItems: "end" }}>
        <Typography style={{ fontSize: "32px", fontWeight: "bold" }}>{`Create User`}</Typography>
      </Card>
      <Card style={{ width: "100%", marginTop: "10px" }}>
        <Row gutter={[8, 8]}>
          <Col span={24} style={{ justifyContent: "end", display: "flex" }}>
            <Button type="primary" onClick={showModal}>{`New User`}</Button>
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
