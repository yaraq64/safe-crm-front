export default function ({ userRole, loggedIn, userLoaded }, routeName) {
  const publicPages = ['login']
  const authRequired = !publicPages.includes(routeName)

  if (userRole === 'florist') {
    if (['orderPage', 'home'].includes(routeName)) {
      return null
    } else {
      return '/'
    }
  } else if (authRequired && !loggedIn && userLoaded) {
    return '/login'
  } else {
    return null
  }
}
