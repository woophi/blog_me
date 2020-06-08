import { Mailer } from 'server/mails';
import { EmailTemplate } from 'server/mails/types';
import Users from 'server/models/users';
import VkGroupPosts from 'server/models/vkGroupPosts';
import { ROLES } from 'server/identity';
import { Logger } from 'server/logger';
import { AgendaJobName } from 'server/lib/agenda/constants';

export const sendeNotificationEmailAboutHaudiPost = async (postId: number) => {
  try {
    Logger.info('Getting new data to send vk post email');

    const admin = await Users.findOne()
      .where('roles')
      .in([ROLES.GODLIKE])
      .select('email -_id')
      .lean();
    const vkPost = await VkGroupPosts.findOne({ postId }).exec();

    await vkPost.set({ notified: true }).save();

    Logger.info('Successfully configured data to send vk post email');

    const mailer = new Mailer(
      AgendaJobName.messageToAdminAboutNewVkPost + Date.now(),
      EmailTemplate.vkPost,
      [admin.email],
      `Новый пост у хауди`,
      '',
      'Администрация сайта',
      {
        text: vkPost.text,
        url: vkPost.postUrl,
      }
    );

    mailer.performQueue();
  } catch (error) {
    Logger.error(error);
  }
};
