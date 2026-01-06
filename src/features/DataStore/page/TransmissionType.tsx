import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Carousel,
  Image,
  List,
  Popconfirm,
  Skeleton,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { ITransmitionTypes } from '../../../types/types';
import { DataStoreService } from '../services/DataStore.service';

export const TransmissionType = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [images, setImages] = useState<File[]>([]);
  const [data, setData] = useState<ITransmitionTypes | null>(null);
  const [mainLoading, setMainLoading] = useState(false);

  const title = data && `${data.name}`;

  useEffect(() => {
    if (params.id) {
      const fetch = async () => {
        try {
          setMainLoading(true);
          const trType = await DataStoreService.transmisionTypes.getOne(
            params.id!
          );

          setData(trType);
        } catch (error) {
          console.log(error);
        } finally {
          setMainLoading(false);
        }
      };

      fetch();
    }
  }, [params.id]);

  useEffect(() => {
    if (data && data?.imageNames) {
      const fetch = async () => {
        try {
          const promises = data.imageNames?.map((name) => {
            return DataStoreService.transmisionTypes.getImages(data.id!, name);
          });

          if (promises?.length) {
            const rawImages = await Promise.all(promises);

            const files = rawImages.map((blob, idx) => {
              const name = data.imageNames
                ? data.imageNames[idx]
                : `${idx}.png`;

              return new File([blob], name, {
                type: blob.type,
              });
            });

            setImages(files);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetch();
    }
  }, [data]);

  const actions: React.ReactNode[] = [
    <Button
      color="primary"
      onClick={() =>
        navigate(`/data-store/transmission-type/edit/${data?.id}`)
      }>
      <EditOutlined />
    </Button>,
    <Popconfirm
      title="Видалення виду передачі"
      description="Ви дійсно бажаєте видалити вид передачі? Він не буде відображатись в списку видів передач, але залишиться в історичних перехопленнях."
      okText="Так"
      cancelText="Відміна"
      onConfirm={async () => {
        if (data?.id) {
          await DataStoreService.transmisionTypes.delete(data.id);
          navigate(-1);
        }
      }}>
      <Button danger variant="solid" disabled>
        <DeleteOutlined />
      </Button>
    </Popconfirm>,
  ];

  return (
    <div>
      <Card
        loading={mainLoading}
        actions={actions}
        cover={
          <Carousel arrows draggable>
            {images.map((img) => {
              return <Image src={URL.createObjectURL(img)} height={300} />;
            })}
          </Carousel>
        }>
        <Card.Meta title={title} />
        {data ? (
          <div>
            <Typography.Text
              style={{ textAlign: 'left', display: 'block', marginBottom: 10 }}>
              <b>Протокол:</b> {data.protocol}
            </Typography.Text>
            <Typography.Text
              style={{ textAlign: 'left', display: 'block', marginBottom: 10 }}>
              <b>Вид передачі:</b> {data.transmissionType}
            </Typography.Text>
            <Typography.Text
              style={{ textAlign: 'left', display: 'block', marginBottom: 10 }}>
              <b>СТК (центральна частота налагодження/орієнтування) (Fстк): </b>
              {data.centralFrequency} Гц
            </Typography.Text>

            <Typography.Text
              style={{ textAlign: 'left', display: 'block', marginBottom: 10 }}>
              <b>Особливості сигналу: </b>
              {data.additionalInformation}
            </Typography.Text>

            <List
              style={{
                marginBottom: 5,
              }}
              header={
                <Typography.Text
                  style={{ textAlign: 'left', display: 'block' }}>
                  <b>Тип абонентів:</b>
                </Typography.Text>
              }
              bordered
              dataSource={data.abonents}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text
                    key={item}
                    style={{
                      textAlign: 'left',
                      display: 'block',
                    }}>
                    <CaretRightOutlined /> {item}
                  </Typography.Text>
                </List.Item>
              )}
            />

            <List
              header={
                <Typography.Text
                  style={{ textAlign: 'left', display: 'block' }}>
                  <b>Радіомережі країн, що використовують:</b>
                </Typography.Text>
              }
              bordered
              dataSource={data.usageNetworks}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text
                    key={item}
                    style={{
                      textAlign: 'left',
                      display: 'block',
                    }}>
                    <CaretRightOutlined /> {item}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <Skeleton />
        )}
      </Card>
      {/* <TransmissionTypeForm defaultData={{ data: data!, images }} /> */}
    </div>
  );
};
