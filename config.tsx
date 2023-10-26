export const config = {
  menu: [
    
    {
      title: 'MENU',
      submenu: [
        {
          icon: '/admin/images/sidebar/dashboard.svg',
          key: 'dashboard',
          title: 'Dashboard',
          path: '/',
          children: [
            {
              title: 'eCommerce',
              path: '/'
            }
          ]
        },
        {
          icon: '/admin/images/sidebar/calendar.svg',
          key: 'calendar',
          title: 'Calendar',
          path: '/calendar',
          children: []
        },
        {
          icon: '/admin/images/sidebar/ic-users.svg',
          key: 'users',
          title: 'Thông tin nhân viên',
          path: '/users',
          children: []
        },
        {
          icon: '/admin/images/sidebar/ic-category-blogs.svg',
          key: 'category-blogs',
          title: 'Danh mục Blogs',
          path: '/category-blogs',
          children: []
        },
        {
          icon: '/admin/images/sidebar/profile.svg',
          key: 'profile',
          title: 'Profile',
          path: '/profile',
          children: []
        },
        {
          icon: '/admin/images/sidebar/form.svg',
          key: 'forms',
          title: 'Forms',
          path: '/forms',
          children: [
            {
              title: 'Form Elements',
              path: '/forms/form-elements'
            },
            {
              title: 'Form Layout',
              path: '/forms/form-layout'
            }
          ]
        },
        {
          icon: '/admin/images/sidebar/table.svg',
          key: 'tables',
          title: 'Tables',
          path: '/tables',
          children: []
        },
        {
          icon: '/admin/images/sidebar/setting.svg',
          key: 'settings',
          title: 'Settings',
          path: '/settings',
          children: []
        },
      ]
    },
    {
      title: 'QUÀ TẶNG',
      submenu: [
        {
          icon: '/admin/images/sidebar/cart.svg',
          key: 'products',
          title: 'Sản phẩm',
          path: '/products',
          children: []
        },
        {
          icon: '/admin/images/sidebar/table.svg',
          key: 'blogs',
          title: 'Tin tức',
          path: '/blogs/list',
          children: []
        }
      ]
    },
    {
      title: 'OTHERS',
      submenu: [
        {
          icon: '/admin/images/sidebar/chart.svg',
          key: 'chart',
          title: 'Chart',
          path: '/chart',
          children: []
        },
        {
          icon: '/admin/images/sidebar/ui.svg',
          key: 'ui',
          title: 'UI Elements',
          path: '/ui',
          children: [
            {
              title: 'Alerts',
              path: '/ui/alerts'
            },
            {
              title: 'Buttons',
              path: '/ui/buttons'
            }
          ]
        }
      ]
    }
  ]
}