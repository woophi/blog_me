import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  makeStyles,
  NativeSelect,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  DelationReason,
  ExpectedActionPayload,
  UnbanReason,
  UserDetail,
} from 'core/models/admin';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  setReasonLabel,
  setUnbanReasonLabel,
  setLeagueTypeLabel,
  unbanUser,
  banUser,
  getFriendUserDetail,
  removeSubFromUser,
  addSubToUser,
} from '../operations';
import moment from 'moment';
import { ModalDialog } from 'ui/atoms/modal';
import { UserFriendsList } from './UserFriends';
import { ActionButton } from 'ui/atoms/ActionButton';

export const SelectedUserDetail: FC<{ data?: UserDetail }> = (props) => {
  const [selectedReason, setReason] = useState(DelationReason.Swearing);
  const [selectedDuration, setDuration] = useState(ExpectedActionPayload.BanW);
  const [coinsToUpdate, setCoins] = useState(0);
  const [
    {
      banInfo,
      sub,
      userInfo = {},
      quizInfo,
      friends,
      rank,
      userDelations = [],
      coins = 0,
    },
    setUserData,
  ] = useState<UserDetail>(props.data ?? ({} as UserDetail));

  useEffect(() => {
    if (props.data) setUserData(props.data);
  }, [props.data]);

  const reloadData = useCallback((vkUserId: number) => {
    getFriendUserDetail(vkUserId).then(setUserData);
  }, []);
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

            <Typography color="textSecondary" gutterBottom>
              Количество монет - {coins}
            </Typography>
            <Divider />
            <Typography color="secondary" gutterBottom>
              Подписка
            </Typography>
            {sub ? (
              <Typography color="textSecondary" gutterBottom>
                Тип подписки - {sub.subscriptionType} до {moment(sub.until).format()}
              </Typography>
            ) : null}
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
            <Box display="flex" flexDirection="column">
              <Box margin="1rem">
                {banInfo?.until ? (
                  <ActionButton
                    label={'разбанить'}
                    action={() =>
                      unbanUser({
                        vkUserId: userInfo.userId,
                        reason: UnbanReason.Expired,
                      }).then(() => reloadData(userInfo.userId))
                    }
                  />
                ) : (
                  <>
                    <ActionButton
                      label={'забанить'}
                      action={() =>
                        banUser({
                          vkUserId: userInfo.userId,
                          reason: selectedReason,
                          until: selectedDuration,
                        }).then(() => reloadData(userInfo.userId))
                      }
                    />
                    <NativeSelect
                      value={selectedReason}
                      onChange={(e) =>
                        setReason(Number(e.target.value) as DelationReason)
                      }
                    >
                      <option value={DelationReason.Insult}>Insult</option>
                      <option value={DelationReason.Violence}>Violence</option>
                      <option value={DelationReason.Swearing}>Mat</option>
                    </NativeSelect>
                    <NativeSelect
                      value={selectedDuration}
                      onChange={(e) =>
                        setDuration(e.target.value as ExpectedActionPayload)
                      }
                    >
                      <option value={ExpectedActionPayload.BanW}>week</option>
                      <option value={ExpectedActionPayload.BanM}>month</option>
                      <option value={ExpectedActionPayload.BanYears}>100let</option>
                    </NativeSelect>
                  </>
                )}
              </Box>
              <Divider />
              <Box margin="1rem">
                {sub?.until ? (
                  <ActionButton
                    label={'удалить подписку'}
                    action={() =>
                      removeSubFromUser({
                        vkUserId: userInfo.userId,
                      }).then(() => reloadData(userInfo.userId))
                    }
                  />
                ) : (
                  <>
                    <ActionButton
                      label={'добавить подписку'}
                      action={() =>
                        addSubToUser({
                          vkUserId: userInfo.userId,
                        }).then(() => reloadData(userInfo.userId))
                      }
                    />
                  </>
                )}
              </Box>
              <Divider />
              <Box margin="1rem">
                <TextField
                  label="Монеты"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => setCoins(Number(e.target.value))}
                />
              </Box>
            </Box>
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
