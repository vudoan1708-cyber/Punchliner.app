<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";

	import Home from "./views/Home.svelte";
	import Account from "./views/Account.svelte";
	import EditorLayout from "./views/EditorLayout.svelte";
	import NotFound from "./views/NotFound.svelte";

  const fallbackRoute = (pathname) => {
    if (pathname.includes('/account') && !pathname.includes('register')) {
      window.location.href = '/account/login';
    }
  };

  const createAnnouncement = (route, location) => {
    const viewName = route.meta.name;
		const { pathname } = location;

    fallbackRoute(pathname);
    return `Navigated to the ${viewName} view at ${pathname}`;
  };
</script>

<Router a11y={{ createAnnouncement }}>
  <div>
    <Route path="/" meta="{{ name: 'home' }}" primary={false}>
      <Home />
    </Route>

    <Route path="account/login" meta="{{ name: 'user account login' }}" primary={false}>
      <Account accessActivity="login" />
    </Route>

    <Route path="account/register" meta="{{ name: 'user account register' }}" primary={false}>
      <Account accessActivity="register" />
    </Route>

    <Route path="editor" meta="{{ name: 'editor' }}" primary={false}>
      <EditorLayout />
    </Route>

    <Route path="*" meta="{{ name: 'not found' }}">
      <NotFound />
    </Route>
  </div>
</Router>
