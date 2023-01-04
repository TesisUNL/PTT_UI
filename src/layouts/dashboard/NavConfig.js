// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  user: getIcon('ic_user'),
  banking: getIcon('ic_banking'),
  ecommerce: getIcon('ic_ecommerce'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const NavConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'General', path: PATH_DASHBOARD.root, icon: ICONS?.dashboard }]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS?.user,
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list },
        ]
      },

      // MANAGEMENT : attraction
      {
        title: 'attraction',
        path:  PATH_DASHBOARD.attraction.root,
        icon: ICONS?.booking,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.attraction.list },
 //         { title: 'post', path: "/" },
          { title: 'new post', path: PATH_DASHBOARD.attraction.newPost }
        ]
      }
    ]
  }
];

export default NavConfig;
