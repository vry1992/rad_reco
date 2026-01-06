import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { ITransmitionTypes } from '../../../types/types';
import { TransmissionTypeForm } from '../components/TransmissionTypeForm';
import { DataStoreService } from '../services/DataStore.service';

export const TransmissionTypeEdit = () => {
  const params = useParams<{ id: string }>();
  const [images, setImages] = useState<File[]>([]);
  const [data, setData] = useState<ITransmitionTypes | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetch = async () => {
        try {
          const trType = await DataStoreService.transmisionTypes.getOne(
            params.id!
          );

          setData(trType);
        } catch (error) {
          console.log(error);
        } finally {
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

  return (
    <div>
      <Typography.Title level={3}>Редагування виду передачі: </Typography.Title>
      <TransmissionTypeForm defaultData={{ data: data!, images }} />
    </div>
  );
};
