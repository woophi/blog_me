import { CSSProperties } from 'react';
import { goToSpecific } from 'core/common';

export const styleTruncate: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
};

export const toBlogs = () => goToSpecific('/admin/blogs');
export const toQuizzes = () => goToSpecific('/admin/quizzes');
export const toBans = () => goToSpecific('/admin/bans');
export const toComments = () => goToSpecific('/admin/comments');
export const toInstagram = () => goToSpecific('/admin/instagram');
export const toUsers = () => goToSpecific('/admin/users');
export const toAdmin = () => goToSpecific('/admin');
export const toHome = () => goToSpecific('/');
