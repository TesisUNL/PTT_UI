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
    items: [{ title: 'booking', path: "/dashboard/user", icon: ICONS?.booking }]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: "dashboard/user",
        icon: ICONS?.user,
        children: [
          { title: 'profile', path: "/dashboard/user/profile" },
          { title: 'cards', path: "dashboard/user/cards" },
          { title: 'list', path: "dashboard/user/list"},
          { title: 'create', path: "dashboard/user/create" },
          { title: 'edit', path: "dashboard/user/edit" },
          { title: 'account', path:"dashboard/user/account" }
        ]
      },

      // MANAGEMENT : E-COMMERCE
      {
        title: 'e-commerce',
        path: "/",
        icon: ICONS?.cart,
        children: [
          { title: 'shop', path: "/" },
          { title: 'product', path: "/"},
          { title: 'list', path: "/" },
          { title: 'create', path: "/" },
          { title: 'edit', path: "/" },
          { title: 'checkout', path: "/" },
          { title: 'invoice', path: "/" }
        ]
      },

      // MANAGEMENT : BLOG
      {
        title: 'blog',
        path: "/dashboard/attraction",
        icon: ICONS?.blog,
        children: [
          { title: 'posts', path:"/dashboard/attraction" },
          { title: 'post', path: "/" },
          { title: 'new post', path: "/" }
        ]
      }
    ]
  }
];

export default NavConfig;
