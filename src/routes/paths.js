// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
//  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
/*   about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs', */
  page404: '/404',
  page500: '/500',
/*   components: '/components' */
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
  /*   cards: path(ROOTS_DASHBOARD, '/user/cards'), */
    list: path(ROOTS_DASHBOARD, '/user/list'),
   /*  newUser: path(ROOTS_DASHBOARD, '/user/new'), */
/*     editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`), */
/*     account: path(ROOTS_DASHBOARD, '/user/account') */
  },
  attraction: {
    root: path(ROOTS_DASHBOARD, '/attraction'),
    newPost: path(ROOTS_DASHBOARD, '/attraction/new-post'),
    list: path(ROOTS_DASHBOARD, '/attraction/list'),
/*     post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post') */
  }
};

