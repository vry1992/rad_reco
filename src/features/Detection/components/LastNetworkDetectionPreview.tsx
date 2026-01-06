import { Typography } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Fragment, useCallback, type FC } from 'react';
import { useNavigate } from 'react-router';
import { DATE_TIME_FORMAT } from '../../../constants';
import {
  AbonentDirectionEnum,
  type IDetection,
  type IShip,
  type IUnit,
} from '../../../types/types';
import { buildShipLabel, buildUnitsLabel } from '../../../utils';
import classes from './style.module.scss';

type Props = {
  detection: IDetection;
};

type DirectionData = { ships: IShip[]; units: IUnit[] };

const separator = ' / ';

export const LastNetworkDetectionPreview: FC<Props> = ({ detection }) => {
  const navigate = useNavigate();
  const { network, abonents, timeOfDetection } = detection;
  // const [fromImg, setFromImg] = useState<string | undefined>();
  // const [toImg, setToImg] = useState<string | undefined>();

  const data = abonents.reduce<Record<AbonentDirectionEnum, DirectionData>>(
    (acc, curr) => {
      const isShip = !!curr.ship;
      const isUnit = !!curr.unit;

      if (isShip && curr.ship) {
        acc[curr.role].ships.push(curr.ship);
      } else if (isUnit && curr.unit) {
        acc[curr.role].units.push(curr.unit);
      }
      return acc;
    },
    {
      [AbonentDirectionEnum.FROM]: {
        ships: [],
        units: [],
      } as DirectionData,
      [AbonentDirectionEnum.TO]: {
        ships: [],
        units: [],
      } as DirectionData,
    } as Record<AbonentDirectionEnum, DirectionData>
  );

  const fromShips = data[AbonentDirectionEnum.FROM].ships.map((ship) =>
    buildShipLabel(ship)
  );
  const fromUnits = data[AbonentDirectionEnum.FROM].units.map((unit) =>
    buildUnitsLabel(unit)
  );

  const from = [...fromShips, ...fromUnits].join(separator);

  const toShips = data[AbonentDirectionEnum.TO].ships.map((ship) =>
    buildShipLabel(ship)
  );
  const toUnits = data[AbonentDirectionEnum.TO].units.map((unit) =>
    buildUnitsLabel(unit)
  );

  const to = [...toShips, ...toUnits].join(separator);

  // useEffect(() => {
  //   const getFrom = async () => {
  //     const data = await DetectionsService.getScreenshot(
  //       detection.network.id,
  //       detection.id,
  //       'from.png'
  //     );
  //     if (data.size) {
  //       const url = URL.createObjectURL(data);
  //       setFromImg(url);
  //     }
  //   };

  //   const getTo = async () => {
  //     const data = await DetectionsService.getScreenshot(
  //       detection.network.id,
  //       detection.id,
  //       'to.png'
  //     );
  //     if (data.size) {
  //       const url = URL.createObjectURL(data);
  //       setToImg(url);
  //     }
  //   };

  //   getFrom();
  //   getTo();
  // }, []);

  const onPreviewClick = useCallback(() => {
    navigate(detection.network.id, { state: detection });
  }, []);

  return (
    <Fragment>
      <div
        className={classes.detectionPreviewContainer}
        onClick={onPreviewClick}>
        <Typography.Title className={classes.title} level={5}>
          {network.name}
        </Typography.Title>
        <Typography.Paragraph className={classes.paragraph}>
          {from ? (
            <>
              <b>Хто: </b>
              <i>{from}</i>
            </>
          ) : null}
        </Typography.Paragraph>
        <Typography.Paragraph className={classes.paragraph}>
          {to ? (
            <>
              <b>Кого: </b>
              <i>{to}</i>
            </>
          ) : null}
        </Typography.Paragraph>
        <Typography.Paragraph className={classes.paragraph}>
          <b>Частота: </b> {detection.frequency}
        </Typography.Paragraph>
        <Typography.Paragraph
          className={classNames([classes.paragraph, classes.rightAligned])}>
          <b>Вид передачі: </b> {detection.transmissionType.name}
        </Typography.Paragraph>
        <Typography.Paragraph
          className={classNames([classes.paragraph, classes.rightAligned])}>
          <b>{dayjs(timeOfDetection).format(DATE_TIME_FORMAT)}</b>
        </Typography.Paragraph>
      </div>
    </Fragment>
  );
};
