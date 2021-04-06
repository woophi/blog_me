import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { DelationReason, UserDetail } from 'core/models/admin';
import { FC, useState } from 'react';
import {
  setReasonLabel,
  setUnbanReasonLabel,
  setLeagueTypeLabel,
} from '../operations';
import moment from 'moment';
import { ModalDialog } from 'ui/atoms/modal';
import { UserFriendsList } from './UserFriends';

export const SelectedUserDetail: FC<{ data?: UserDetail }> = (props) => {
  const {
    banInfo,
    userInfo = {},
    donations = [],
    quizInfo,
    friends,
    rank,
    userDelations = [],
  } = props.data ?? {};
  const classes = useStyles();
  const [openQuizModal, setOpen] = useState(false);
  const questionsMap = Object.values(quizInfo?.questions ?? {});

  return (
    <>
      <Box marginLeft="1rem" marginTop="1rem">
        <Card className={classes.container}>
          <CardMedia className={classes.media} image={userInfo.avatar} />
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {userInfo.name}
            </Typography>

            <Typography color="secondary" gutterBottom>
              Донаты
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Количество донатов - {donations.length}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Сумма за все время -{' '}
              {donations.reduce((sum, next) => (sum += next.amount), 0)}
            </Typography>
            <Divider />

            <Typography color="secondary" gutterBottom>
              Бан инфо
            </Typography>
            {banInfo ? (
              <Typography color="textSecondary" gutterBottom>
                Количество банов - {banInfo.times}
              </Typography>
            ) : null}
            {banInfo?.until ? (
              <Typography color="textSecondary" gutterBottom>
                Забанен за - {setReasonLabel(banInfo.reason)} до{' '}
                {moment(banInfo.until).format()}
              </Typography>
            ) : banInfo ? (
              <Typography color="textSecondary" gutterBottom>
                Разбанен - {setUnbanReasonLabel(banInfo.unbanReason)}
              </Typography>
            ) : null}
            <Typography color="textSecondary" gutterBottom>
              Отправлено жалоб на пользователя за мат -{' '}
              {userDelations.find((ud) => ud.reason === DelationReason.Swearing)
                ?.amountOfReasons ?? 0}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Отправлено жалоб на пользователя за оскорбления -{' '}
              {userDelations.find((ud) => ud.reason === DelationReason.Insult)
                ?.amountOfReasons ?? 0}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Отправлено жалоб на пользователя за насилие -{' '}
              {userDelations.find((ud) => ud.reason === DelationReason.Violence)
                ?.amountOfReasons ?? 0}
            </Typography>
            <Divider />

            <Typography color="secondary" gutterBottom>
              Quizz
            </Typography>
            {quizInfo ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpen(true)}
              >
                посмотреть
              </Button>
            ) : (
              <Typography color="textSecondary" gutterBottom>
                пользователь еще не создал тест
              </Typography>
            )}
            <Divider />

            <Typography color="secondary" gutterBottom>
              Ранг
            </Typography>
            {rank ? (
              <Typography color="textSecondary" gutterBottom>
                #{rank.points}:{' '}
                {setLeagueTypeLabel(rank.leagueGroup.globalLeague.leagueType)} -{' '}
                {rank.leagueGroup.groupOrder}. {rank.barrack.name}
              </Typography>
            ) : (
              <Typography color="textSecondary" gutterBottom>
                пользователь удалил тест или сезон окончен
              </Typography>
            )}
            <Divider />
          </CardContent>
          <CardActions>
            {banInfo?.until ? (
              <Button size="small">разбанить</Button>
            ) : (
              <Button size="small">забанить</Button>
            )}
          </CardActions>
        </Card>
        <ModalDialog
          withActions={false}
          open={openQuizModal}
          onClose={() => setOpen(false)}
          title={'Quiz пользователя'}
        >
          <Box>
            {questionsMap.map((q) => (
              <div
                style={{
                  background: q.backgroundCard.replace(';', ''),
                  color: '#424242',
                }}
                key={q.step}
              >
                <h3>{q.question}</h3>
                <div>Ответы</div>
                {q.answers.map((a, i) => (
                  <div key={i}>
                    {`${i + 1}. Emoji: ${a.emoji}, Text: ${a.text}`}
                    <br />
                  </div>
                ))}
              </div>
            ))}
          </Box>
        </ModalDialog>
      </Box>
      <UserFriendsList list={friends} />
    </>
  );
};

const useStyles = makeStyles({
  media: {
    height: 80,
  },
  container: {
    minWidth: '180px',
    maxWidth: '380px',
  },
});
